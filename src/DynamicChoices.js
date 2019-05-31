const DynamicChoices = function ({ defaultConfig = {}, paramConfig = {} }) {
  const CONFIG_OVERRIDES = {
    noChoicesText: '',
    shouldSort: false,
    searchChoices: false,
    removeItemButton: true,
    duplicateItemsAllowed: false
  }

  const PARAM_CONFIG_DEFAULT = {
    boxId: '',
    boxClassNames: '',
    searchButtonId: '',
    searchButtonTitle: 'Search',
    searchButtonClassNames: '',
    searchButtonInnerHtml: 'Search',
    clearButtonId: '',
    clearButtonTitle: 'Clear',
    clearButtonClassNames: '',
    clearButtonInnerHtml: 'Clear',
    transformValueFnc: false,
    apiUrl: '',
    xhrProgressCallback: false,
    searchValue: 'id',
    labelValue: 'text',
    xhrErrorCallback: false,
    xhrMethod: 'POST',
    xhrHeaders: [
      {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    ],
    xhrResponseType: 'json',
    xhrQueryKey: '',
    lookupDelay: 300,
    searchButtonClickCallback: false,
    addChoiceCallback: false,
    removeItemCallback: false
  }

  let config = {
    placeholderValue: 'Start typing',
    itemSelectText: 'Press enter to select',
    classNames: {
      containerOuter: 'choices',
      containerInner: 'choices__inner',
      listItems: 'choices__list--multiple',
      item: 'choices__item',
      highlightedState: 'is-highlighted',
      button: 'choices__button',
      input: 'choices__input',
      listDropdown: 'choices__list--dropdown',
      itemSelectable: 'choices__item--selectable'
    }
  }

  if (defaultConfig === Object(defaultConfig)) {
    Object.assign(config, defaultConfig, CONFIG_OVERRIDES)
  } else {
    Object.assign(config, CONFIG_OVERRIDES)
  }

  if (paramConfig === Object(paramConfig)) {
    paramConfig = Object.assign({}, PARAM_CONFIG_DEFAULT, paramConfig)
  } else {
    paramConfig = PARAM_CONFIG_DEFAULT
  }
  class DynamicChoices extends HTMLElement {
    connectedCallback () {
      this._serverLookup = this._serverLookup.bind(this)
      this._searchEvent = this._searchEvent.bind(this)
      this._choiceEvent = this._choiceEvent.bind(this)
      this._searchButtonClick = this._searchButtonClick.bind(this)
      this._clearButtonClick = this._clearButtonClick.bind(this)
      this._addItemEvent = this._addItemEvent.bind(this)
      this._removeItemEvent = this._removeItemEvent.bind(this)

      this._lookupTimeout = null

      this.render()

      const dc = this.querySelector('[data-hook="DynamicChoices"]')
      // Trigger an API lookup when the user pauses after typing.
      dc.addEventListener('search', this._searchEvent)

      // We want to clear the API-provided options when a choice is selected.
      dc.addEventListener('choice', this._choiceEvent)

      // Other events
      dc.addEventListener('addItem', this._addItemEvent)
      dc.addEventListener('removeItem', this._removeItemEvent)

      this.querySelector('[data-hook="DynamicChoices-search"]').addEventListener('click', this._searchButtonClick)
      this.querySelector('[data-hook="DynamicChoices-clear"]').addEventListener('click', this._clearButtonClick)
    }
    render () {
      this.innerHTML = `
        <style>
          .${config.classNames.containerOuter} {
            flex: 1 !important;
            margin-bottom: 0;
          }
        </style>
        <div id="${paramConfig.boxId}" class="${paramConfig.boxClassNames}" style="display: flex;">
          <select data-hook="DynamicChoices" multiple></select>
          <button id="${paramConfig.searchButtonId}" title="${paramConfig.searchButtonTitle}" data-hook="DynamicChoices-search" class="${paramConfig.searchButtonClassNames}">${paramConfig.searchButtonInnerHtml}</button>
          <button id="${paramConfig.clearButtonId}" title="${paramConfig.clearButtonTitle}" data-hook="DynamicChoices-clear" class="${paramConfig.clearButtonClassNames}" style="display:none;">${paramConfig.clearButtonInnerHtml}</button>
        </div>`
      this._choices = new Choices('[data-hook="DynamicChoices"]', config)
      this._choices.input.element.addEventListener('focus', e => {
        this.querySelector(`.${config.classNames.listDropdown}`).style.display = 'none'
      })
      this._choices.input.element.addEventListener('keyup', e => {
        if (e.target.value !== '') {
          this.querySelector(`.${config.classNames.listDropdown}`).style.display = ''
        } else {
          this.querySelector(`.${config.classNames.listDropdown}`).style.display = 'none'
        }
      })
      this._choices.input.element.addEventListener('blur', e => {
        this.querySelector(`.${config.classNames.listDropdown}`).style.display = 'none'
      })
    }
    disconnectedCallback () {
      const dc = this.querySelector('[data-hook="DynamicChoices"]')

      dc.removeEventListener('search', this._searchEvent)
      dc.removeEventListener('choice', this._choiceEvent)
      dc.removeEventListener('addItem', this._addItemEvent)
      dc.removeEventListener('removeItem', this._removeItemEvent)

      this.querySelector('[data-hook="DynamicChoices-search"]').removeEventListener('click', this._searchButtonClick)
      this.querySelector('[data-hook="DynamicChoices-clear"]').removeEventListener('click', this._clearButtonClick)

      this._choices.destroy()
    }
    _log (...args) {
      console.group('dynamic-choices')
      console.log(...args)
      console.groupEnd()
    }
    _serverLookup (val) {
      let query = this._choices.input.value || val || ''

      if (query === '') {
        this._choices.clearChoices()
      } else {
        if (typeof paramConfig.transformValueFnc === 'function') {
          query = paramConfig.transformValueFnc(query)
        }
      }

      if (paramConfig.apiUrl !== '') {
        const xhr = new XMLHttpRequest()

        // call progress callback
        if (typeof paramConfig.xhrProgressCallback === 'function') {
          xhr.upload.addEventListener('progress', paramConfig.xhrProgressCallback)
        }

        // response received/failed
        xhr.onreadystatechange = e => {
          if (xhr.readyState === 4) {
            let results = xhr.response
            let isEmptyResults = false
            if (Array.isArray(results)) {
              results.map(obj => {
                let cp = obj.customProperties = {}
                for (let k in obj) {
                  if (k !== 'customProperties') {
                    cp[k] = obj[k]
                  }
                }
              })
              if (results.length === 0) {
                // used to clear items list if results array is empty
                results = [' ']
                isEmptyResults = true
              }
              if (val && isEmptyResults === false) {
                let exact = results.map((obj, index) => {
                  if (obj[paramConfig.searchValue] === query || obj[paramConfig.searchValue] === val) {
                    return index
                  }
                }).filter(x => {
                  return x > -1
                })
                if (exact.length > 0) {
                  results[exact[0]].selected = true
                }
              }
              this._choices.setChoices(results, paramConfig.searchValue, paramConfig.labelValue, true)
              if (this._choices.input.value !== '' && isEmptyResults === false) {
                this.querySelector(`.${config.classNames.listDropdown}`).style.display = ''
              }
            }
          }
        }

        if (typeof paramConfig.xhrErrorCallback === 'function') {
          xhr.onerror = paramConfig.xhrErrorCallback
        }

        xhr.open(paramConfig.xhrMethod, paramConfig.apiUrl, true)
        xhr.responseType = paramConfig.xhrResponseType
        if (Array.isArray(paramConfig.xhrHeaders)) {
          for (let x = 0; x < paramConfig.xhrHeaders.length; x++) {
            let xh = paramConfig.xhrHeaders[x]
            for (let h in xh) {
              xhr.setRequestHeader(h, xh[h])
            }
          }
        }
        const xhrQueryKey = paramConfig.xhrQueryKey !== '' ? paramConfig.xhrQueryKey + '=' : ''
        xhr.send(xhrQueryKey + query)
      }
    }
    _searchEvent () {
      clearTimeout(this._lookupTimeout)
      this._lookupTimeout = setTimeout(this._serverLookup, paramConfig.lookupDelay)
    }
    _choiceEvent (e) {
      this._choices.clearChoices()
    }
    _searchButtonClick (e) {
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      if (typeof paramConfig.searchButtonClickCallback === 'function') {
        paramConfig.searchButtonClickCallback(e)
      }
    }
    _clearButtonClick (e) {
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      const event = new Event('beforeClearAll')
      this.dispatchEvent(event)

      this.removeChoices()
    }
    _addItemEvent (e) {
      this.querySelector('[data-hook="DynamicChoices-clear"]').style = 'display:block;'
      this._choices.hideDropdown(true)
      if (typeof paramConfig.addChoiceCallback === 'function') {
        paramConfig.addChoiceCallback(this.getChoices(true))
      } else {
        this._searchButtonClick()
      }
    }
    _removeItemEvent (e) {
      const gc = this.getChoices(true)
      if (gc.length === 0) {
        this.querySelector('[data-hook="DynamicChoices-clear"]').style = 'display:none;'
      }
      if (typeof paramConfig.removeItemCallback === 'function') {
        paramConfig.removeItemCallback()
      }
    }
    addChoice (paramObj) {
      if (paramObj && paramObj.hasOwnProperty('value')) {
        const val = paramObj.value
        if (paramObj.hasOwnProperty('removeAll') && paramObj.removeAll === true) {
          this._choices.removeActiveItems()
        } else {
          const gc = this.getChoices()
          let obj = gc.find(c => c.label === val)

          if (obj) {
            this._choices.removeActiveItemsByValue(obj.value)
          }
        }
        this._serverLookup(val)
      }
    }
    removeChoices () {
      this._choices.removeActiveItems()
    }
    removeChoiceByValue (val) {
      this._choices.removeActiveItemsByValue(val)
    }
    getChoices (arrayOnly) {
      return this._choices.getValue(arrayOnly || false)
    }
  }
  window.customElements.define('dynamic-choices', DynamicChoices)
  return document.querySelector('dynamic-choices')
}

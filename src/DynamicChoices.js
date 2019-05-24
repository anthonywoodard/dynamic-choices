(function () {
  const config = {
    placeholderValue: 'Start typing a [whatever]',
    noChoicesText: '',
    itemSelectText: 'Press enter to select',
    shouldSort: false,
    searchFloor: 1,
    searchChoices: false,
    removeItemButton: true,
    duplicateItemsAllowed: false
  }
  const styleConfig = {
    itemStyle: '',
    closeButtonStyle: '',
    boxInnerStyle: '',
    searchInputStyle: '',
    listItemHighlighted: ''
  }

  const listDropdownSelector = '.choices__list--dropdown'

  const defaultXHRHeaders = [
    {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  ]

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
      const itemStyle = this.getAttribute('item-style')
      const closeButtonStyle = this.getAttribute('close-button-style')
      const boxInnerStyle = this.getAttribute('box-inner-style')
      const searchInputStyle = this.getAttribute('search-input-style')
      const listItemHighlighted = this.getAttribute('list-item-highlighted')

      if (itemStyle) {
        styleConfig.itemStyle = itemStyle
      }
      if (closeButtonStyle) {
        styleConfig.closeButtonStyle = closeButtonStyle
      }
      if (boxInnerStyle) {
        styleConfig.boxInnerStyle = boxInnerStyle
      }
      if (searchInputStyle) {
        styleConfig.searchInputStyle = searchInputStyle
      }
      if (listItemHighlighted) {
        styleConfig.listItemHighlighted = listItemHighlighted
      }

      config.placeholderValue = this.getAttribute('placeholder-value') || config.placeholderValue
      config.shouldSort = this.getAttribute('should-sort') || config.shouldSort
      config.searchFloor = this.getAttribute('search-floor') || config.searchFloor
      config.removeItemButton = this.getAttribute('remove-item-button') || config.removeItemButton
      config.duplicateItemsAllowed = this.getAttribute('duplicate-items-allowed') || config.duplicateItemsAllowed
      config.noChoicesText = this.getAttribute('no-choices-text') || config.noChoicesText
      config.itemSelectText = this.getAttribute('item-select-text') || config.itemSelectText

      this.innerHTML = `
        <style>
          .choices {
            flex: 1 !important;
            margin-bottom: 0;
          }
          .choices__list--multiple .choices__item, .choices__list--multiple .choices__item.is-highlighted {
            ${styleConfig.itemStyle}
          }
          .choices[data-type*="select-multiple"] .choices__button {
            ${styleConfig.closeButtonStyle}
          }
          .choices__inner {
            ${styleConfig.boxInnerStyle}
          }
          .choices__input {
            ${styleConfig.searchInputStyle}
          }
          .choices__list--dropdown {
            z-index: 20000;
          }
          .choices__list--dropdown .choices__item--selectable.is-highlighted {
            ${styleConfig.listItemHighlighted}
          }
        </style>
        <div id="${this.getAttribute('box-id') || ''}" class="${this.getAttribute('box-style')}" style="display: flex;">
          <select data-hook="DynamicChoices" multiple></select>
          <button id="${this.getAttribute('search-button-id') || ''}" title="${this.getAttribute('search-button-title') || 'Search'}" data-hook="DynamicChoices-search" class="${this.getAttribute('search-button-class-names')}">${this.getAttribute('search-button-inner-html') || 'Search'}</button>
          <button id="${this.getAttribute('clear-button-id') || ''}" title="${this.getAttribute('clear-button-title') || 'Clear'}" data-hook="DynamicChoices-clear" class="${this.getAttribute('clear-button-class-names')}" style="display:none;">${this.getAttribute('clear-button-inner-html') || 'Clear'}</button>
        </div>`
      this._choices = new Choices('[data-hook="DynamicChoices"]', config)
      this._choices.input.element.addEventListener('focus', e => {
        this.querySelector(listDropdownSelector).style.display = 'none'
      })
      this._choices.input.element.addEventListener('keyup', e => {
        if (e.target.value !== '') {
          this.querySelector(listDropdownSelector).style.display = ''
        } else {
          this.querySelector(listDropdownSelector).style.display = 'none'
        }
      })
      this._choices.input.element.addEventListener('blur', e => {
        this.querySelector(listDropdownSelector).style.display = 'none'
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
        if (typeof this.transformValueFnc === 'function') {
          query = this.transformValueFnc(query)
        }
      }

      if (this.getAttribute('api-url') !== '') {
        const xhr = new XMLHttpRequest()

        // call progress callback
        if (typeof this.progressCallback === 'function') {
          xhr.upload.addEventListener('progress', this.progressCallback)
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
                  if (obj[this.getAttribute('search-value')] === query || obj[this.getAttribute('search-value')] === val) {
                    return index
                  }
                }).filter(x => {
                  return x > -1
                })
                if (exact.length > 0) {
                  results[exact[0]].selected = true
                }
              }
              this._choices.setChoices(results, this.getAttribute('search-value') || 'id', this.getAttribute('label-value') || 'text', true)
              if (this._choices.input.value !== '' && isEmptyResults === false) {
                this.querySelector(listDropdownSelector).style.display = ''
              }
            }
          }
        }

        if (typeof this.errorCallback === 'function') {
          xhr.onerror = this.errorCallback
        }

        xhr.open(this.getAttribute('xhr-method') || 'POST', this.getAttribute('api-url'), true)
        xhr.responseType = this.getAttribute('xhr-response-type') || 'json'
        this.xhrHeaders = this.xhrHeaders || defaultXHRHeaders
        if (Array.isArray(this.xhrHeaders)) {
          for (let x = 0; x < this.xhrHeaders.length; x++) {
            let xh = this.xhrHeaders[x]
            for (let h in xh) {
              xhr.setRequestHeader(h, xh[h])
            }
          }
        }
        const xhrQueryKey = this.getAttribute('xhr-query-key') + '=' || ''
        xhr.send(xhrQueryKey + query)
      }
    }
    _searchEvent () {
      clearTimeout(this._lookupTimeout)
      this._lookupTimeout = setTimeout(this._serverLookup, this.getAttribute('lookup-delay') || 300)
    }
    _choiceEvent (e) {
      this._choices.clearChoices()
    }
    _searchButtonClick (e) {
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      if (typeof this.searchButtonClickCallback === 'function') {
        this.searchButtonClickCallback(e)
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
      if (typeof this.addChoiceCallback === 'function') {
        this.addChoiceCallback(this.getChoices(true))
      } else {
        this._searchButtonClick()
      }
    }
    _removeItemEvent (e) {
      const gc = this.getChoices(true)
      if (gc.length === 0) {
        this.querySelector('[data-hook="DynamicChoices-clear"]').style = 'display:none;'
      }
      if (typeof this.removeItemCallback === 'function') {
        this.removeItemCallback()
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
})()

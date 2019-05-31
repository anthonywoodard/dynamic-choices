# DynamicChoices
HTML Element Wrapper and Dynamically Filled Options Functionality for [Choices.js](https://github.com/jshjohnson/Choices)

## Installation
**Note:** Choices.js must be installed.  See [Choices.js](https://github.com/jshjohnson/Choices) for installation directions.

**Download code from GitHub or install using NPM:**
```
npm install https://github.com/anthonywoodard/dynamic-choices
```
## Setup
```
const dc = DynamicChoices({
  defaultConfig: {
    placeholderValue: "Start typing here",
  },
  paramConfig: {
    apiUrl: "/api",
    searchButtonClassNames: "btn btn-outline-primary",
    searchButtonInnerHtml: "<i class=&quot;fa fa-search&quot; aria-hidden=&quot;true&quot;></i>",
    boxClassNames: "d-flex justify-content-between mb-4",
    xhrQueryKey: "query",
    searchButtonClickCallback: function(){
      console.log('searched')
    }
  }
})
```
## Configuration options
### Choices.js options can be passed in via the `defaultConfig` object parameter. All options can be configured except:
- noChoicesText
- shouldSort
- searchChoices
- removeItemButton
- duplicateItemsAllowed

### Default Choices.js option values:
- placeholderValue: 'Start typing'
- itemSelectText: 'Press enter to select'

### DynamicChoices paramConfig object default values:
```
{
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
  transformValueFnc: false,  // function
  apiUrl: '',
  searchValue: 'id',
  labelValue: 'text',
  xhrMethod: 'POST',
  xhrProgressCallback: false, // function
  xhrErrorCallback: false, // function
  xhrHeaders: [
    {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  ],
  xhrResponseType: 'json',
  xhrQueryKey: '',
  lookupDelay: 300,
  searchButtonClickCallback: false, // function
  addChoiceCallback: false, // function
  removeItemCallback: false // function
}
```
## DynamicChoices instance methods
### addChoice(paramObj)
**Usage:** paramObj is an object and must have `value` key.  If paramObj has `removeAll: true` then all active items will be removed first.

### removeChoices()
**Usage:** Removes all items.

### removeChoiceByValue(value)
**Usage:** Removes item by value.

### getChoices(arrayOnly)
**Usage:** Get value(s) of input (i.e. inputted items (text) or selected choices (select)). Optionally pass an argument of true to only return values rather than value objects.
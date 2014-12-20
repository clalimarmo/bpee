define (require) ->
  $ = require('jquery')
  View = require('file_selector/view')

  describe 'file_selector_view', ->
    mocks = {}
    view = null


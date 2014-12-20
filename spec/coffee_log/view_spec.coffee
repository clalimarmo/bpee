define (require) ->
  $ = require('jquery')
  View = require('coffee_log/view')

  describe 'coffee_log/view', ->

    mocks = {}
    view = null

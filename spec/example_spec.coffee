define (require) ->

  exampleModule = require('example_module')

  describe 'infrastructure', ->

    it 'works', ->
      expect(exampleModule.hello).to.eq('world')

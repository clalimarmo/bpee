define (require) ->
  CoffeeLogger = require('coffee_log/coffee_logger')

  describe 'coffee logger', ->

    coffeeLogger = null
    mocks = {}

    beforeEach ->
      mocks.file = {}
      mocks.file.data = ->
        history: [
          {barista: 'Carlos', time: '50 seconds'},
          {barista: 'Gian', time: '180 seconds'},
        ]
      mocks.file.onLoadedCallback = null
      mocks.file.onLoaded = (cb) -> mocks.file.onLoadedCallback = cb

    it 'loads history from a file', ->
      coffeeLogger = CoffeeLogger(file: mocks.file)

      mocks.file.onLoadedCallback()
      expect(coffeeLogger.history()).to.deep.eq(mocks.file.data().history)

    it 'runs onUpdated callbacks when the file loads', ->
      anotherCallbackCalled = 'onUpdated callback called?'
      makeTestPass = -> anotherCallbackCalled = true

      coffeeLogger = CoffeeLogger(file: mocks.file)
      coffeeLogger.onFileLoaded(makeTestPass)

      mocks.file.onLoadedCallback()

      expect(anotherCallbackCalled).to.be.true

    it 'considers its file closed if there is no filename', ->
      mocks.file.filename = -> null

      coffeeLogger = CoffeeLogger(file: mocks.file)
      expect(coffeeLogger.fileIsOpen()).to.be.false

    it 'considers its file open if there is a filename', ->
      mocks.file.filename = -> 'my-file.txt'

      coffeeLogger = CoffeeLogger(file: mocks.file)
      expect(coffeeLogger.fileIsOpen()).to.be.true

    it 'adds and saves records', ->
      mocks.file.savedData = 'saved data'
      mocks.file.save = (data) ->
        mocks.file.savedData = data

      coffeeLogger = CoffeeLogger(file: mocks.file)

      newRecord = {barista: 'intern', coffeeQuality: 'poor'}
      coffeeLogger.addRecord(newRecord)

      expect(coffeeLogger.history()).to.deep.include(newRecord)
      expect(mocks.file.savedData).to.be.an('object')
      expect(mocks.file.savedData.history).to.deep.include(newRecord)

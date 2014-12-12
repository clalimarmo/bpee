define (require) ->
  CoffeeLogger = require('coffee_log/coffee_logger')

  describe 'coffee logger', ->

    coffeeLogger = null
    mocks = {}

    beforeEach ->
      mocks.savedData = {}
      mocks.savedData['smartlogic_coffee_history'] =
        lastHistoryRecordId: 2
        history: {
          1: {
            date: '2014-12-03'
            barista: 'Brian'
            method: 'Aeropush (inverted)'
            time: '2 minutes'
            grind: '1.5 scoops medium roast, fine grind'
          }
          2: {
            date: '2014-12-03'
            barista: 'Giancarlo'
            method: 'Aeropush (normal)'
            time: '90 s'
            grind: '2 scoops medium roast, fine grind'
          }
        }
        reviews: {
          1: [
            'pretty good - Brian'
            'yuck - Carlos'
            'hot dog water - Ara'
          ]
          2: [
            'terrible'
          ]
        }

      mocks.datastore = {
        put: (key, data) -> mocks.savedData[key] = data
        get: (key, handlers) -> handlers.success(mocks.savedData[key])
      }

    it 'loads records from the datastore upon initialization', ->
      coffeeLogger = CoffeeLogger(
        datastore: mocks.datastore
        filename: 'smartlogic_coffee_history'
      )

      expect(coffeeLogger.history()).to.deep.eq(mocks.savedData['smartlogic_coffee_history'].history)
      expect(coffeeLogger.reviews()).to.deep.eq(mocks.savedData['smartlogic_coffee_history'].reviews)

    it 'initializes records in the datastore if it encounters an error', ->
      datastorePutArgs = 'datastore.put was called with...'
      mocks.datastore.get = (key, handlers) -> handlers.error()
      mocks.datastore.put = (filename, data) -> datastorePutArgs = {
        filename: filename
        data: data
      }

      coffeeLogger = CoffeeLogger(
        datastore: mocks.datastore
        filename: 'smartlogic_coffee_history'
      )

      expect(coffeeLogger.history()).to.deep.eq({})
      expect(coffeeLogger.reviews()).to.deep.eq({})

      # the implication is that the error handler calls datastore.put with initial data
      expect(datastorePutArgs.filename).to.eq('smartlogic_coffee_history')
      expect(datastorePutArgs.data.history).to.deep.eq({})
      expect(datastorePutArgs.data.reviews).to.deep.eq({})
      expect(datastorePutArgs.data.lastHistoryRecordId).to.eq(0)

    it 'saves new records', ->
      coffeeLogger = CoffeeLogger(
        datastore: mocks.datastore
        filename: 'smartlogic_coffee_history'
      )

      coffeeLogger.addRecord(
        date: '2018-12-03'
        barista: 'Sam'
        method: 'Pour over'
        time: 'n/a'
        grind: '12 grams dark roast, fine grind'
      )

      savedData = mocks.savedData['smartlogic_coffee_history']
      expect(savedData).to.be.ok

      savedHistory = savedData.history
      expect(savedHistory).to.be.ok

      savedRecord = savedHistory[3]
      expect(savedRecord).to.be.ok

      expect(savedRecord.date).to.eq('2018-12-03')
      expect(savedRecord.barista).to.eq('Sam')
      expect(savedRecord.method).to.eq('Pour over')
      expect(savedRecord.time).to.eq('n/a')
      expect(savedRecord.grind).to.eq('12 grams dark roast, fine grind')

    it 'saves new reviews', ->
      coffeeLogger = CoffeeLogger(
        datastore: mocks.datastore
        filename: 'smartlogic_coffee_history'
      )

      coffeeLogger.reviewRecord(1, 'better than 7/11 - Dan')

    it 'calls onUpdated callbacks when its data has been fetched', (done) ->
      onFetchedCalled = 'on-fetched callback called?'
      onFetched = ->
        onFetchedCalled = true
        done()

      anotherCallbackCalled = 'another callback called?'
      anotherCallback = ->
        anotherCallbackCalled = true

      # (onfetched should be called in the callback passed to datastore.get)
      mocks.datastore.get = (filename, handlers) ->
        setTimeout(1000)
        handlers.success(mocks.savedData[filename])

      coffeeLogger = CoffeeLogger(
        onFetched: onFetched
        datastore: mocks.datastore
        filename: 'smartlogic_coffee_history'
      )

      coffeeLogger.onUpdated(anotherCallback)

      expect(onFetchedCalled).to.be.true
      expect(anotherCallbackCalled).to.be.true

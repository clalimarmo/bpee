define (require) ->
  View = require('coffee_log/view')

  describe 'coffee_log/view', ->

    mocks = {}
    view = null

    it 'show the coffee log', ->
      mocks.reviews = {
        1: [
          'pretty good - Brian'
          'yuck - Carlos'
          'hot dog water - Ara'
        ]
        2: [
          'terrible'
        ]
      }

      mocks.history = {
        1: {
          date: '2014-12-03'
          barista: 'Brian'
          method: 'Aeropush (inverted)'
          time: '2 minutes'
          temperature: '200 F'
          grind: '1.5 scoops medium roast, fine grind'
        }
        2: {
          date: '2014-12-03'
          barista: 'Giancarlo'
          method: 'Aeropush (normal)'
          time: '90 s'
          temperature: '195 F'
          grind: '1.5 scoops medium roast, fine grind'
          grind: '2 scoops medium roast, fine grind'
        }
      }

      mocks.coffeeLogger = {
        reviews: -> mocks.reviews
        history: -> mocks.history
        onUpdated: -> return
      }

      mocks.$container = $('<div/>');

      view = View(
        coffeeLogger: mocks.coffeeLogger
        container: mocks.$container
      )

      $history = view.$('.history')
      expect(mocks.$container.text()).to.include('2014-12-03')
      expect(mocks.$container.text()).to.include('Brian')
      expect(mocks.$container.text()).to.include('Giancarlo')
      expect(mocks.$container.text()).to.include('Aeropush (normal)')
      expect(mocks.$container.text()).to.include('Aeropush (inverted)')
      expect(mocks.$container.text()).to.include('1.5 scoops medium roast, fine grind')
      expect(mocks.$container.text()).to.include('2 scoops medium roast, fine grind')
      expect(mocks.$container.text()).to.include('2 minutes')
      expect(mocks.$container.text()).to.include('90 s')
      expect(mocks.$container.text()).to.include('200 F')
      expect(mocks.$container.text()).to.include('195 F')
      expect(mocks.$container.text()).to.include('pretty good - Brian')
      expect(mocks.$container.text()).to.include('yuck - Carlos')
      expect(mocks.$container.text()).to.include('hot dog water - Ara')

    it 'adds records to the coffee log', ->
      mocks.records = []
      mocks.coffeeLogger.addRecord = (record) ->
        mocks.records.push(record)
      mocks.$container = $('<div/>')

      view = View(
        coffeeLogger: mocks.coffeeLogger,
        container: mocks.$container
      )

      $recordForm = mocks.$container.find('.add-record')
      $recordForm.find('.barista').val('Carlos')
      $recordForm.find('.method').val('x-mug')
      $recordForm.find('.grind').val('1 "brekkies blend" instapack')
      $recordForm.find('.time').val('n/a')
      $recordForm.find('.temperature').val('203 F')
      $recordForm.find('input[type="submit"]').click()

      expect(mocks.records.length).to.eq(1)

      newRecord = mocks.records[0]

      expect(newRecord.barista).to.eq('Carlos')
      expect(newRecord.method).to.eq('x-mug')
      expect(newRecord.grind).to.eq('1 "brekkies blend" instapack')
      expect(newRecord.time).to.eq('n/a')
      expect(newRecord.temperature).to.eq('203 F')

      expect(mocks.$container.text()).to.contain('Carlos')

    it 're-renders when the coffee logger updates', ->
      mocks.coffeeLogger.updateCallbacks = []
      mocks.coffeeLogger.updated = ->
        for callback in mocks.coffeeLogger.updateCallbacks
          callback(mocks.coffeeLogger)
      mocks.coffeeLogger.onUpdated = (callback) ->
        mocks.coffeeLogger.updateCallbacks.push(callback)

      view = View(
        coffeeLogger: mocks.coffeeLogger
        container: mocks.$container
      )

      mocks.history[3] = {
        date: '2017-10-02'
        barista: 'Raymond'
        method: 'espresso'
        time: '12 s pull'
        temperature: '300 F'
        grind: '8 g'
      }
      mocks.coffeeLogger.updated()

      expect(mocks.$container.text()).to.contain('Raymond')

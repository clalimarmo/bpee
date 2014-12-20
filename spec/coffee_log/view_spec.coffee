define (require) ->
  $ = require('jquery')
  View = require('coffee_log/view')

  describe 'coffee_log/view', ->

    mocks = {}
    view = null

    beforeEach ->
      mocks.$container = $('<div/>')
      mocks.coffeeLogger = {}

      mocks.coffeeLogger.history = -> []
      mocks.coffeeLogger.fileIsOpen = -> false
      mocks.coffeeLogger.onFileLoaded = (callback) ->
        mocks.coffeeLogger.onFileLoadedCallback = callback

      mocks.coffeeLogger.history = ->
        [
          {
            date: '2014-11-12'
            barista: 'Carlos L'
            method: 'inverted'
            brew_time: 80
            brew_temp: 195
            grind: 'fine'
            roast: 'dark'
            capacity_setting: 3
            grind_scoops: 1
            rating: .5
          }
          {
            date: '2014-11-13'
            barista: 'Brian S'
            method: 'inverted'
            brew_time: 120
            brew_temp: 195
            grind: 'fine'
            roast: 'dark'
            capacity_setting: 3
            grind_scoops: 1
            rating: .3
          }
        ]

    it 'indicates if no file is open', ->
      view = View(
        container: mocks.$container
        coffeeLogger: mocks.coffeeLogger
      )

      expect(mocks.$container.find('.nothing-loaded').css('display')).to.not.eq('none')
      expect(mocks.$container.find('.content').css('display')).to.eq('none')

    it 'shows coffee logger history', ->
      view = View(
        container: mocks.$container
        coffeeLogger: mocks.coffeeLogger
      )

      mocks.coffeeLogger.onFileLoadedCallback()

      $history = mocks.$container.find('.history')
      for entry, entryIndex in mocks.coffeeLogger.history()
        for key, value of entry
          $row = $($history.find('tr.history-record')[entryIndex])
          $cell = $row.find(".#{key}")
          expect($cell.text()).to.eq(String(value))

    it 'adds records to coffee logger history', ->
      addedRecord = 'added record'
      mocks.coffeeLogger.addRecord = (record) -> addedRecord = record
      mocks.barista = 'Timmy'

      view = View(
        container: mocks.$container
        coffeeLogger: mocks.coffeeLogger
        barista: mocks.barista
      )

      # file must be loaded before adding records
      mocks.coffeeLogger.onFileLoadedCallback()

      $form = $(mocks.$container.find('.add-record'))
      newRecord = {
        method: 'inverted'
        brew_time: 1
        brew_temp: 200
        grind: 'fine'
        roast: 'dark'
        capacity_setting: 4
        grind_scoops: 0
        rating: 1
      }
      for key, value of newRecord
        $input = $form.find("[name='#{key}']")
        expect($input).to.be.ok
        $input.val(value)

      $submit = $form.find("input[type='submit']")
      expect($submit).to.be.ok
      $submit.click()

      for key, value of newRecord
        expect(addedRecord[key]).to.eq(value)

      expect(addedRecord.barista).to.eq('Timmy')

define (require) ->
  $ = require('jquery')
  View = require('file_selector/view')

  describe 'file_selector/view', ->
    mocks = {}
    view = null

    beforeEach ->
      mocks.$container = $('<div/>')
      mocks.file = {}
      mocks.file.onLoaded = -> null
      mocks.file.filename = -> ''
      mocks.fileList = [{name: 'README'}, {name: 'code.js'}]

    it 'shows a list of files', ->
      view = View(
        container: mocks.$container
        file: mocks.file
      )
      view.showFiles(mocks.fileList)

      expect(mocks.$container.find('option').length).to.eq(2)
      expect(mocks.$container.find('option[value="README"]').text()).to.eq('README')
      expect(mocks.$container.find('option[value="code.js"]').text()).to.eq('code.js')

    it 'opens the selected file', ->
      openedFile = 'opened file'
      mocks.file.open = (file) -> openedFile = file

      view = View(
        container: mocks.$container
        file: mocks.file
      )
      view.showFiles(mocks.fileList)

      mocks.$container.find('select').val('code.js').change()
      expect(openedFile).to.eq('code.js')

    it 'initializes, and opens a new file', ->
      userEnteredFilename = 'secret recipes'
      mocks.newFilePrompt = -> userEnteredFilename

      initializedFile = 'initialized file'
      newFileMetadata = 'new file metadata'
      openedFile = 'opened file'
      mocks.file.dir = (callback) -> callback(['README', 'code.js', userEnteredFilename])
      mocks.file.onLoaded = (callback) -> mocks.file.onLoadedCallback = callback
      mocks.file.open = (filename) -> openedFile = filename
      mocks.file.init = (filename, metadata, opts) ->
        initializedFile = filename
        newFileMetadata = metadata
        opts.success()

      view = View(
        container: mocks.$container
        newFilePrompt: mocks.newFilePrompt
        file: mocks.file
      )

      mocks.$container.find('.new-file').click()

      expect(initializedFile).to.eq(mocks.newFilePrompt())
      expect(newFileMetadata).to.be.null
      expect(openedFile).to.eq(userEnteredFilename)

    it 'shows the open filename', ->
      mocks.file.load = -> null
      mocks.file.onLoaded = (callback) -> mocks.file.load = callback
      mocks.file.filename = -> null

      view = View(
        container: mocks.$container
        file: mocks.file
      )
      view.showFiles(mocks.fileList)

      mocks.file.filename = -> 'code.js'
      mocks.file.load()
      expect(mocks.$container.find('select').val()).to.eq('code.js')

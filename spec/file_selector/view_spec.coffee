define (require) ->
  $ = require('jquery')
  View = require('file_selector/view')

  describe 'file_selector_view', ->
    mocks = {}
    view = null

    beforeEach ->
      mocks.$container = $('<div/>')
      mocks.fileList = [
        {name: '1', displayName: 'file1'}
        {name: '2', displayName: 'file2'}
        {name: 'D', displayName: 'fileD'}
      ]
      mocks.getSelectedFile = -> 'D'
      mocks.parseFileList = (list) -> list

      view = View(
        getSelectedFile: mocks.getSelectedFile
        container: mocks.$container
        parseFileList: mocks.parseFileList
      )

    it 'shows files from a list', ->
      view.showFiles(mocks.fileList)

      expect(mocks.$container.find('select option[value="1"]').text()).to.eq('file1')
      expect(mocks.$container.find('select option[value="2"]').text()).to.eq('file2')
      expect(mocks.$container.find('select option[value="D"]').text()).to.eq('fileD')

    it 'shows the selected file', ->
      view.showFiles(mocks.fileList)

      expect(mocks.$container.find('select').val()).to.eq('D')

    it 'registers and calls onSelected callbacks', ->
      mocks._onSelectedCalledWith = 'mocks.onSelected called with...'
      mocks.onSelected = (selectedFile) ->
        mocks._onSelectedCalledWith = selectedFile

      view.showFiles(mocks.fileList)

      view.onSelected(mocks.onSelected)
      view.$('select').val('1').change()
      expect(view.$('select').val()).to.eq('1')

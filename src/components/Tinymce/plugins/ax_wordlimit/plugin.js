window.tinymce.PluginManager.add('ax_wordlimit', function (editor) {
  var pluginName = '字数限制';
  var global$1 = window.tinymce.util.Tools.resolve('tinymce.util.Tools');
  var global$2 = window.tinymce.util.Tools.resolve('tinymce.util.Delay');
  var ax_wordlimit_type = editor.getParam('ax_wordlimit_type', 'letter');
  var ax_wordlimit_num = editor.getParam('ax_wordlimit_num', false);
  var ax_wordlimit_delay = editor.getParam('ax_wordlimit_delay', 500);
  var ax_wordlimit_callback = editor.getParam('ax_wordlimit_callback', function () { });
  var ax_wordlimit_event = editor.getParam('ax_wordlimit_event', 'SetContent Undo Redo Keyup');
  var onsign = 1;
  /**
   * @统计方法1：计算总字数,空格算一个,换行也算一个字数,去除标签和样式
   * 
  */
  var sumLetter = function () {
    var html = editor.getContent();
    var re1 = new RegExp("<.+?>", "g");
    var txt = html.replace(re1, '');
    txt = txt.replace(/\n/g, '');//  换行也算一个字数
    txt = txt.replace(/&nbsp;/g, ' ');//  空格算一个字数
    var num = txt.length;
    return { txt: txt, num: num }
  }
  /**
   * ax_wordlimit_callback
   * @editor
   *@flag 预留位,变化时可以更改样式
   *@txt 实际文本
   *@ax_wordlimit_num 限制字数
   */
  var onAct = function () {
    if (onsign) {
      onsign = 0;
      //此处预留更多统计方法  ax_wordlimit_type
      switch (ax_wordlimit_type) {
        case 'letter':
        default:
          var res = sumLetter();
      }

      ax_wordlimit_callback(editor, res.num > ax_wordlimit_num, res.txt, ax_wordlimit_num);
      setTimeout(function () { onsign = 1 }, ax_wordlimit_delay);
    }

  }
  var setup = function () {
    if (ax_wordlimit_num > 0) {
      global$2.setEditorTimeout(editor, function () {
        var doth = editor.on(ax_wordlimit_event, onAct);
      }, 300);
    }
  };

  setup();
  //  右下角显示统计字数
  function update () {
    editor.theme.panel.find('#wordcount').text(['Words: {0}', self.getCount()]);
  }
  //  初始化时显示右下角统计字符
  editor.on('init', function () {
    var statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0];
    if (statusbar) {
      window.setTimeout(function () {
        statusbar.insert({
          type: 'label',
          name: 'wordcount',
          text: ['Words: {0}', self.getCount()],
          classes: 'wordcount',
          disabled: editor.settings.readonly
        }, 0);

        editor.on('setcontent beforeaddundo', update);

        editor.on('keyup', function (e) {
          if (e.keyCode == 32) {
            update();
          }
        });
      }, 0);
    }
  });
  //  获取字符长度
  self.getCount = function () {
    let tc = 0;
    tc = sumLetter().txt.length
    return tc
  }
  return {
    getMetadata: function () {
      return {
        name: pluginName,
        url: "http://tinymce.ax-z.cn/more-plugins/ax_wordlimit.php",
      };
    }
  };
});

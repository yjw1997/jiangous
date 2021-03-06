<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage
        v-if="upload"
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from "./components/EditorImage";
import plugins from "./plugins/plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";
import { Message } from "element-ui";
import { uploadMinIo } from "@/components/upload/ImageUploadModal/minio.js"

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
export default {
  name: "Tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      },
    },
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    upload: {
      type: Boolean,
      default: false,
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
    limit: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja",
      },
      messageShow: false,
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },
  },
  watch: {
    value(val, oldval) {
      console.log(`%c ${val}`, "font-size:30px");
      // console.log(`%c ${oldval}`,"font-size:30px")
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
        );
      }
    },
    messageShow(flag) {
      if (flag) {
        Message.closeAll();
        Message.warning(`当前字数：超出限制，限制字数： ${this.limit}`);
      }
    },
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      // load(tinymceCDN, (err) => {
      //   if (err) {
      //     Message.error(err.message)
      //     return
      //   }
      //   this.initTinymce()
      // })
      this.initTinymce();
    },
    initTinymce() {
      const _this = this;
      require("./plugins/ax_wordlimit/plugin.min.js");
      window.tinymce.init({
        branding: false,
        selector: `#${this.tinymceId}`,
        ax_wordlimit_num: _this.limit,
        ax_wordlimit_callback: function (editor, flag) {
          //  统计师实际字数,一个换行算一个字数,标签等不算字数
          _this.messageShow = flag;
          //触发表单自定义验证
          _this.$parent.$emit("el.form.change");
          if (flag) {
            editor.editorContainer.style.border = "1px solid red";
          } else {
            editor.editorContainer.style.border = "1px solid #c5c5c5";
          }
        },
        language: this.languageTypeList["zh"],
        height: this.height,
        body_class: "panel-body",
        object_resizing: true, //  是否能自定义拉伸图片
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        contentStyle:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        fontsize_formats: "11px 14px 17px 18px 21px 30px", //设置字体像素
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            _this.hasChange = true;
            _this.$emit("input", editor.getContent());
          });
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", (e) => {
            _this.fullscreen = e.state;
          });
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        // images_upload_handler(blobInfo, success, failure, progress) {
        //   console.log(blobInfo.blob());
        //   console.log(blobInfo.name());
        // progress(0);
        // const token = _this.$store.getters.token;
        // getToken(token).then(response => {
        //   const url = response.data.qiniu_url;
        //   const formData = new FormData();
        //   formData.append('token', response.data.qiniu_token);
        //   formData.append('key', response.data.qiniu_key);
        //   formData.append('file', blobInfo.blob(), url);
        //   upload(formData).then(() => {
        //     success(url);
        //     progress(100);
        //   })
        // }).catch(err => {
        //   failure('出现未知问题，刷新页面，或者联系程序员')
        //   console.log(err);
        // });
        // },
      });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        this.setContent("");
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      console.log(
        "%c [ arr ]",
        "font-size:13px; background:pink; color:#bf2c9f;",
        arr
      );
      arr.forEach((v) =>
        window.tinymce
          .get(this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v}" >`)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
    .mce-panel {
      border: 1px solid #c5c5c5;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>

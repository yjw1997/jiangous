<template>
  <div class="app-container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo"><img :src="logo" alt="logo" /> Form Generator</div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div class="components-title"><svg-icon icon-class="component" />输入型组件</div>
          <draggable
            class="components-draggable"
            :list="inputComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
          >
            <div
              v-for="(element, index) in inputComponents"
              :key="index"
              class="components-item"
              @click="addComponent(element)"
            >
              <div class="components-body">
                <svg-icon :icon-class="element.tagIcon" />
                {{ element.label }}
              </div>
            </div>
          </draggable>
          <div class="components-title"><svg-icon icon-class="component" />选择型组件</div>
          <draggable
            class="components-draggable"
            :list="selectComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
          >
            <div
              v-for="(element, index) in selectComponents"
              :key="index"
              class="components-item"
              @click="addComponent(element)"
            >
              <div class="components-body">
                <svg-icon :icon-class="element.tagIcon" />
                {{ element.label }}
              </div>
            </div>
          </draggable>
          <div class="components-title"><svg-icon icon-class="component" />布局型组件</div>
          <draggable
            class="components-draggable"
            :list="layoutComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
          >
            <div
              v-for="(element, index) in layoutComponents"
              :key="index"
              class="components-item"
              @click="addComponent(element)"
            >
              <div class="components-body">
                <svg-icon :icon-class="element.tagIcon" />
                {{ element.label }}
              </div>
            </div>
          </draggable>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar ">
        <el-row class="center-board-row"> 中间 </el-row>
      </el-scrollbar>
    </div>
    <right-panel />
  </div>
</template>

<script>
import RightPanel from './RightPanel'
import logo from '@/assets/logo/logohide.png'
import draggable from 'vuedraggable'
import { inputComponents, selectComponents, layoutComponents } from '@/utils/generator/config'
export default {
  name: 'Build',
  components: { logo, RightPanel, draggable },
  props: {},
  data() {
    return { logo, inputComponents, selectComponents, layoutComponents, drawingList: [] }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    download() {
      this.dialogVisible = true
      this.showFileName = true
      this.operationType = 'download'
    },
    run() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'run'
    },
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(() => {
        this.drawingList = []
      })
    },
    copy() {
      this.dialogVisible = true
      this.showFileName = false
      this.operationType = 'copy'
    },
  },
}
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
  }
}
.left-board {
  width: 260px;
  height: 100vh;
}
.left-scrollbar {
  height: calc(100vh - 42px);
  overflow: hidden;
}
.center-scrollbar {
  height: calc(100vh - 42px);
  overflow: hidden;
  border-left: 1px solid #f1e8e8;
  border-right: 1px solid #f1e8e8;
  box-sizing: border-box;
}

.center-board {
  height: 100vh;
  flex: 1;
  box-sizing: border-box;
}
.center-board-row {
  width: 100%;
  padding: 12px 12px 15px 12px;
  box-sizing: border-box;
  & > .el-form {
    // 69 = 12+15+42
    height: calc(100vh - 69px);
  }
}
.logo-wrapper {
  position: relative;
  height: 42px;
  background: #fff;
  border-bottom: 1px solid #f1e8e8;
  box-sizing: border-box;
}
.logo {
  line-height: 30px;
  color: #00afff;
  font-weight: 600;
  font-size: 17px;
  white-space: nowrap;
  > img {
    width: 30px;
    height: 30px;
    vertical-align: top;
  }
  .github {
    display: inline-block;
    vertical-align: sub;
    margin-left: 15px;
    > img {
      height: 22px;
    }
  }
}
.action-bar {
  & .el-button + .el-button {
    margin-left: 15px;
  }
  & i {
    font-size: 20px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }
}
.action-bar {
  position: relative;
  height: 42px;
  text-align: right;
  padding: 0 15px;
  box-sizing: border-box;
  border: 1px solid #f1e8e8;
  border-top: none;
  border-left: none;
  .delete-btn {
    color: #f56c6c;
  }
}
.components-list {
  padding: 8px;
  box-sizing: border-box;
  height: 100%;
  .components-item {
    display: inline-block;
    width: 48%;
    margin: 1%;
    transition: transform 0ms !important;
  }
}
.components-draggable {
  padding-bottom: 20px;
}
.components-title {
  font-size: 14px;
  color: #222;
  margin: 6px 2px;
  .svg-icon {
    color: #666;
    font-size: 18px;
  }
}
$selectedColor: #f6f7ff;
$lighterBlue: #409eff;
.components-body {
  padding: 8px 10px;
  background: $selectedColor;
  font-size: 12px;
  cursor: move;
  border: 1px dashed $selectedColor;
  border-radius: 3px;
  .svg-icon {
    color: #777;
    font-size: 15px;
  }
  &:hover {
    border: 1px dashed #787be8;
    color: #787be8;
    .svg-icon {
      color: #787be8;
    }
  }
}
</style>

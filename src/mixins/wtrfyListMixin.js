export const ListMixin = {
  data () {
    return {
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParams: {},
      /* 数据源 */
      dataSource: [],
      /* 数据源 */
      dataList: [],
      /* table加载状态 */
      loading: false,
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '25', '50'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      // 显示搜索条件
      showSearch: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      modulesCode: '',
      treeData: {
        code: 'code',
        parentCode: 'parentCode'
      }
    }
  },
  watch: {

  },
  computed: {

  },
  created () {
    if (!this.disableMixinCreated) {
      this.loadData()
    }
  },
  methods: {
    //  分页查询
    loadData (arg) {
      if (!this.url || !this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      let getAction = this.url.list
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() // 查询条件
      this.loading = true
      return getAction(params).then(res => {
        if (res.code === 0) {
          this.dataSource = res.data.records || res.data
          this.dataList = this.handleTree(this.dataSource, this.treeData.code, this.treeData.parentCode)
          this.ipagination.total = res.total || res.data.total || this.dataSource.length
        }
        if (res.code !== 0) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    //  获取查询条件
    getQueryParams () {
      let param = Object.assign({}, this.queryParams)
      param.current = this.ipagination.current
      param.size = this.ipagination.pageSize
      return param
    },
    //  重置
    resetQuery (obj = {}) {
      this.queryParams = obj
      /* 分页参数 */
      this.ipagination = {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '25', '50'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
        this.loadData(1)
    },
    // 用户状态修改
    handleStatusChange (row, key, theKeyID, changeStatus) {
      let text = row[key] === "0" ? "停用" : "启用";
      this.$confirm('确认要' + text + '吗', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        let obj = Object.assign(row, { [theKeyID]: row[key] })
        return changeStatus(obj);
      }).then(() => {
        this.$message.success('修改状态成功')
        this.modelOK()
      }).catch(function () {
        row[key] = row[key] === "0" ? "1" : "0";
      });
    },
    handleStatusBoolenChange (row, key, theKeyID, changeStatus) {
      let text = row[key] === true ? "启用" : "停用";
      this.$confirm('确认要' + text + '吗', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        let obj = Object.assign(row, { [theKeyID]: row[key] })
        return changeStatus(obj);
      }).then(() => {
        this.$message.success('修改状态成功')
        this.modelOK()
      }).catch(function () {
        row[key] = row[key] === false ? true : false;
      });
    },
    // 用户状态修改
    handleStatusChangeNumber (row, key, theKeyID, changeStatus, id, rowKey) {
      console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      if (id) {
        row[id] = rowKey
      }
      let text = row[key] === 0 ? "停用" : "启用";
      this.$confirm('确认要' + text + '吗', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        let obj = Object.assign(row, { [theKeyID]: row[key] })
        return changeStatus(obj);
      }).then(() => {
        this.$message.success('修改状态成功')
        this.modelOK()
      }).catch(function () {
        row[key] = row[key] === 1 ? 0 : 1;

      });
    },
    // 多选框选中数据
    handleSelectionChange (selectionRows) {
      this.selectionRows = selectionRows
      this.selectedRowKeys = selectionRows.map(item => {

        return item[this.rowKey]
      })
      this.single = selectionRows.length != 1;

      this.multiple = !selectionRows.length;
    },
    //  清除所有选中数据
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    //  编辑
    handleEdit: function (record) {
      record = record.preventDefault ? this.selectionRows[0] : record
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.edit(record)
    },
    //  新增
    handleAdd: function () {
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.add()
    },
    //  详情
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "详情";
      this.$refs.modalForm.disableSubmit = true;
    },
    //  单删
    handleDelete: function (id, title = '删除', parKey = 'id', payload = {}) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      let deleteAction = this.url.delete
      this.$confirm(
        `是否${title}选中数据?`,
        `确认${title}`,
      ).then(() => {
        let obj = Object.assign({
          [parKey]: id
        }, payload)
        deleteAction(obj).then((res) => {
          if (res.code === 0) {
            that.$message.success(res.msg || '删除成功')
            that.loadData()
            that.onClearSelected()
          } else {
            that.$message.warning(res.msg || res.msg || '未知错误')
          }
        }).finally(() => {
          that.loading = false
        })

      }).catch(() => { })
    },
    //  多删
    batchDel: function (idsKey, payload = {}) {
      idsKey = typeof idsKey !== 'string' ? 'ids' : idsKey
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''

        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        ids = ids.substring(0, ids.length - 1)
        var that = this
        let deleteAction = this.url.deleteBatch
        this.$confirm(
          '是否删除选中数据?',
          '确认删除',
        ).then(() => {
          let obj = Object.assign({ [idsKey]: ids }, payload)
          deleteAction(obj).then((res) => {
            if (res.code === 0) {
              that.$message.success(res.msg || '删除成功')
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.msg || res.msg || '未知错误')
            }
          }).finally(() => {
            that.loading = false
          })

        }).catch(() => { })
      }
    },
    modelOK () {
      this.loadData()
    },
  }
}
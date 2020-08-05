<template>
  <div>
    <!-- 用户列表区域 -->
    <el-table :data="userList" border style="width: 100%" stripe>
      <el-table-column type="index" class="tab_index"></el-table-column>
      <el-table-column label="姓名" prop="username" width="180">
      </el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <!-- 作用域插槽:可以通过scope.row拿到这一行的数据 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            @change="userStateChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <!-- 作用域插槽:可以通过scope.row拿到这一行的数据 -->
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUserById(scope.row.id)"
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <span>
        <!-- 主体表单区域 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 修改用户对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法邮箱'))
      }
    }
    // 自定义手机号验证规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法手机号'))
      }
    }
    return {
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户的表单
      editForm: {},
      // 修改用户表单的验证对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选择的角色的id值
      selectedRoleId: ''
    }
  },
  props: {
    userList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() {
    this.$emit('getUserList')
  },
  methods: {
    // 用户状态改变
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
      }
    },
    // 展示修改用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      // 先对表单进行预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请按正确格式修改')
        // 发送修改用户信息提交请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败！')
        }
        // 修改请求成功，关闭对话框
        this.editDialogVisible = false
        // 修改成功后更新用户列表
        this.$emit('getUserList')
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果取消，阻止下方删除程序运行
      if (confirmResult !== 'confirm') {
        return 'cancel'
      }
      // 如果确认，发送删除用户请求
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 删除成功后更新用户列表
      this.$emit('getUserList')
    },
    // 分配角色
    async setRole(userInfo) {
      // 将需要被分配角色的用户信息暂时保存到data中
      this.userInfo = userInfo
      // 打开对话框之前获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      // 将角色列表保存到data中
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 保存角色信息
    async saveRoleInfo() {
      // 如果没有选择角色
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      // 发送分配角色请求
      const {
        data: res
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      // 更新用户列表
      this.$emit('getUserList')
      // 清空已选择的角色id及用户信息，否则下次打开对话框默认会留下上次的角色及权限信息
      this.selectedRoleId = ''
      this.userInfo = {}
      // 关闭对话框
      this.setRoleDialogVisible = false
    }
  }
}
</script>
<style></style>

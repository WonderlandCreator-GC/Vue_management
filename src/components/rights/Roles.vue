<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRoleDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框区域 -->
    <!-- 1.添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%">
      <el-form
        ref="addRoleRef"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 2.编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%">
      <el-form
        ref="editRoleRef"
        :model="editRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 3.分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 1.控制添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单验证规则对象
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 所有角色列表数据
      roleList: [],
      // 2.控制编辑角色表单的显示与隐藏
      editRoleDialogVisible: false,
      // 编辑角色时的原始角色表单
      editRoleForm: {},
      // 3.控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // 嵌套关系的属性
        children: 'children',
        // 决定每个节点的名称的字段
        label: 'authName'
      },
      // 默认选中的节点的id值数组
      defKeys: [],
      // 点击分配权限时的用户的id
      roleId: ''
    }
  },
  created() {
    // 获取角色列表数据
    this.getRoleList()
  },
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // 获取成功后保存到data中的roleList
      this.roleList = res.data
    },
    // 1.显示添加角色对话框
    showAddRoleDialog() {
      this.addRoleDialogVisible = true
    },
    // 添加角色
    async addRole() {
      // 进行表单预验证
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写角色名称')
        }
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        // 更新角色列表
        this.getRoleList()
        // 清空表单
        this.addRoleForm = {}
        // 关闭对话框
        this.addRoleDialogVisible = false
      })
    },
    // 2.显示编辑角色对话框
    showEditRoleDialog(role) {
      // 将当前角色绑定到表单上
      this.editRoleForm = role
      this.editRoleDialogVisible = true
    },
    // 编辑角色
    editRole() {
      // 先进行预验证
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写角色名称')
        }
        // 发送编辑提交请求
        const { data: res } = await this.$http.put(
          `roles/${this.editRoleForm.id}`,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑提交失败')
        }
        this.$message.success('编辑角色成功')
        // 编辑提交成功，更新角色列表
        this.getRoleList()
        this.editRoleDialogVisible = false
      })
    },
    // 3.删除角色
    async deleteRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果点击取消，confirmResult 就为字符串'cancel'
      if (confirmResult === 'cancel') {
        return 'cancel'
      }
      // 如果确认，发送删除角色请求
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      // 更新角色列表
      this.getRoleList()
      this.$message.success('删除角色成功')
    },
    // 4.点击分配权限打开分配权限对话框
    async showSetRightDialog(role) {
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 将所有权限数据储存到data中
      this.rightsList = res.data
      // 递归获取三级节点的id,并放入默认选中的节点的id值数组defKeys中
      this.getLeafKeys(role, this.defKeys)
      // 将此用户的id保存到data
      this.roleId = role.id
      // 弹出设置权限对话框
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框关闭
    setRightDialogClosed() {
      // 重置defKeys
      this.defKeys = []
    },
    // 分配权限
    async allotRights() {
      // 获取所有被选节点的id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将数组转换为id列表字符串
      const idStr = keys.join(',')
      // 发送角色授权请求
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 更新角色列表
      this.getRoleList()
      // 关闭对话框
      this.setRightDialogVisible = false
    },
    // 5.删除权限
    async removeRightsById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 取消删除
      if (confirmResult !== 'confirm') {
        return 'cancel'
      }
      // 确认删除，发送删除权限请求(需要两个参数：用户id及权限id)
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      // 刷新权限列表（不要直接刷新所有角色列表，将修改角色的的权限部分刷新即可）
      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>

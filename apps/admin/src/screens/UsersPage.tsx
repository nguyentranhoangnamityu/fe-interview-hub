import { Mail, Calendar, CheckCircle, XCircle, Search, Filter, Plus, Edit, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAdmin } from '../providers/AdminProvider'

export const UsersPage = () => {
  const { users, usersLoading, createUser, updateUser, deleteUser } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateUser = async (userData: { name: string; email: string; picture?: string }) => {
    try {
      await createUser(userData)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      await updateUser(userId, updates)
      setEditingUser(null)
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(userId)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    await handleUpdateUser(userId, { status: newStatus })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-foreground">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-8rem] h-[20rem] w-[20rem] rounded-full bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-3xl animate-pulse" />
        <div className="absolute -right-24 bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-gradient-to-r from-orange-400/30 to-red-400/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_60%)] dark:bg-none" />
      </div>
      
      <div className="relative flex min-h-screen flex-col">
        <main className="flex w-full flex-1 flex-col gap-4 sm:gap-6 px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-red-700 dark:text-red-400">Quản lý Người dùng</h1>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Quản lý thông tin và trạng thái của người dùng
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm người dùng
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-slate-800 dark:to-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                          <span className="ml-2 text-slate-500">Đang tải...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <div className="text-slate-500">
                          <Mail className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                          <p>Không tìm thấy người dùng nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              {user.picture ? (
                                <img
                                  src={user.picture}
                                  alt={user.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-red-600 font-semibold text-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                            <Mail className="h-4 w-4 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          }`}>
                            {user.status === 'active' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setEditingUser(user)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                              className={`p-1 rounded transition-colors ${
                                user.status === 'active'
                                  ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                              }`}
                            >
                              {user.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Thêm người dùng mới</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleCreateUser({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                picture: formData.get('picture') as string || undefined,
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Avatar URL (tùy chọn)
                  </label>
                  <input
                    type="url"
                    name="picture"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tạo
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Chỉnh sửa người dùng</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleUpdateUser(editingUser.id, {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                picture: formData.get('picture') as string || undefined,
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser.name}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser.email}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Avatar URL (tùy chọn)
                  </label>
                  <input
                    type="url"
                    name="picture"
                    defaultValue={editingUser.picture || ''}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

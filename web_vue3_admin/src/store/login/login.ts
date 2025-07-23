import { defineStore } from "pinia";
import { accountLogin, getUserInfoById, getUserMenusByRoleId } from "@/service/login/login";
import type { UserInfo, loginData } from "@/types";
import { LocalCache } from "@/utils/cache";
import { TOKEN } from "@/global/constants";
const useLoginStore = defineStore('login', {
  state: () => ({
    token: LocalCache.get(TOKEN),
    userInfo: {} as UserInfo,
  }),
  actions: {
    async loginAccountLogin(account: loginData) {
      try {
        const { data } = await accountLogin(account)
        this.userInfo = data as UserInfo
        //获取登录用户的信息
        const userInfo = await getUserInfoById(this.userInfo?.role.id)
        this.userInfo = userInfo as UserInfo
        //根据角色请求用户的权限菜单（menus）
        const userMenus = await getUserMenusByRoleId(this.userInfo.role.id)
        console.log(userMenus)

        return data
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    }



  }
})
export default useLoginStore;

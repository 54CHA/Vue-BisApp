import { defineStore } from 'pinia'

export const useBankStore = defineStore('bank', {
  state: () => ({
    Acct: [
      {id: 1, AcctNum: "0323454353948", balance: 1000, date: Date.now()},
      {id: 2, AcctNum: "9885474575646", balance: 9005},
      {id: 3, AcctNum: "34545346567856", balance: 10005},
  ],
 
  }),

  getters: {
    
  },

  actions: {
    deleteAcct(id) {
      this.Acct = this.Acct.filter(t => {
          return t.id !== id
      })
    },
    addAcct(acct) {
      this.Acct.push(acct)
    },
  }
})

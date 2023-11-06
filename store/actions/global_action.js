export const global_actions = {
  setWallet: (state, action) => {
    state.wallet = action.payload
  },
  setjackpots: (state, action) => {
    state.jacketpots = action.payload
  },
}

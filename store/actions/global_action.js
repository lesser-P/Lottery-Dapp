export const global_actions = {
  setWallet: (state, action) => {
    state.wallet = action.payload
  },
  setjackpots: (state, action) => {
    state.jacketpots = action.payload
  },
  setGeneratorModal: (state, action) => {
    state.generatorModal = action.payload
  },
  setWinnerModal: (state, action) => {
    state.winnerModal = action.payload
  },
  setPurchasedNumbers: (state, action) => {
    state.purchasedNumbers = action.payload
  },
  setParticipants: (state, action) => {
    state.participants = action.payload
  },
}

// //State variable in the plantation reducer
// tokensSubmitted: []

// //Component subscribing to tokensSubmitted variable in reducer
// ffbTokens: state.plantationReducer.tokensSubmitted

// //Function dispatchin action submitting a new token to the blockchain
// onSubmitToken: (weight, date) => dispatch(submitFFBToken(weight, date)),

// //Implementation of token submission function. Must read address
// //of plantation already stored in the state. Chosen user address is also read
// //and thus it becomes possible to send a transaction using web3
// export const submitFFBToken = (weight, date) => {
//   return async (dispatch, getState) => {
//     let plantationAddress = getState().plantationReducer.plantationProperties.address;
//     let userAddress = getState().authenticationReducer.userAddress;

//     let plantation = plantationInstance(plantationAddress);

//     await plantation.methods.submitFFBToken(weight, date).send({
//       from: userAddress,
//       gas: 4712388,
//       gasPrice: 100000000000
//     });

//     //Read the modified state of the blockchain and dispatch
//     //a new action modifying the reducer state accordingly
//     dispatch(fetchTokensSubmitted());
//   };
// };

import * as types from 'actions/portfolio/actionTypes';

const initial = {
  isLoading: false,
  error: false,
  data: [],
}

export default function Portfolio(state = initial, action) {
  switch(action.type){
    case types.PORTFOLIO_REQ_DATA :
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case types.PORTFOLIO_RECV_DATA :
      return {
        ...state,
        isLoading: false,
        error: false,
        data: action.data.rows,
      };
    case types.PORTFOLIO_RECV_ERROR :
      return {
        ...state,
        isLoading: false,
        error: true,
      }
    default :
      return state;
  }
}

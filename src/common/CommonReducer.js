
const CommonReducer = (state = {"annotatedData":[], "filterData":""}, action) => {
 switch (action.type) {	
  	case '_common_':
  		return state
	case 'annotatedData':
	    return Object.assign({}, state, {
	    	annotatedData: action.data
	    })
	case 'filterData':
	    return Object.assign({}, state, {
	    	filterData: action.data
	    })
    default:
      return state
  }
}

export default CommonReducer
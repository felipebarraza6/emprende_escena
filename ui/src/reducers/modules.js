export const modules_reducer = (state, action) => {
  
  switch(action.type){
    
    case 'LOADING':
      return{
        ...state,
        loading:true
      }

    case 'SET_VIEW':
      return{
        ...state,
        loading:false,
        is_retrieve:action.is_retrieve,
        module: action.module || null,
        is_approved: action.is_approved
      }

    default:
      return state

  }


} 

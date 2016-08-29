//home中的数据
import * as types from '../constants/actions/order';
const initialState = {
    main: {
        isFetching: 0,      //是否已经获取 
        didInvalidate: 1,   //是否失效
        addr:{},
        amounts:{},
        logis:{},
        itemArr:[],        //拆分出来的id
        itemObj:{}  
    }
};
function itemInit (data){
    let itemArr = [];
    let itemObj = {};
    for (let i = 0; i < data.order_goods.length; i++) {
        itemArr = [...itemArr,data.order_goods[i].id];
        itemObj[data.order_goods[i].id] = data.order_goods[i];
    }
    addr = data.addr;
    amounts = data.amounts;
    let {addr,amounts,logis} = data;
    return {itemArr,itemObj,addr,amounts,logis};
}
export default function(state = initialState, action) {
    let items,newState;
    switch (action.type) {
        case types.ORDER_GET_MAIN + '_SUCCESS':
            items = itemInit(action.data.data);
            newState = {
                ...state,
                main:{
                    //...action.data,//不需要保存原始数据，保存加工后的数据（如果可以，后端可做处理）
                    ...items,
                    isFetching:1,
                    didInvalidate:1
                }
            };
            return newState;
        case 'CHANGE_PATH':
        case types.ORDER_GET_MAIN + '_ERROR':
            //结算；为了方便，暂时考虑是清空购物车数据
            //console.log(LOCATION_CHANGE);
            return initialState;
        default:
            return state;
    }
};
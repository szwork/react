import React, {
	Component,
	PropTypes
} from 'react';
import * as types from '../../../constants/actions/cart';

/*ant*/
import {
	Modal,
	Toast
} from 'antd-mobile';
/*components*/
import Header from '../../../components/Cart/Header';
import List from '../../../components/Cart/List';
import Footer from '../../../components/Cart/Footer';
import CartNo from '../../../components/Cart/CartNo';
class Cart extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			edit: !0
		};
		this.handleEdit = this.handleEdit.bind(this);// 编辑事件
		this.handleSelect = this.handleSelect.bind(this); // 选择事件
		this.handleDelete = this.handleDelete.bind(this); // 删除
	}
	componentWillMount() {
		console.log('componentWillMount');
		if (this.props.cart.main.isFetching === 0) {
			Toast.loading(null, 0);
			let url = types.CART_MAIN_GET;
			let param = {};

			let params = {
				param: param,
				ajaxType: 'GET',
				onSuccess: (res) => {
					Toast.hide();
					//this.props.history.pushState(null, '/');
				},
				onError: (res) => {
					Toast.hide();
					alert('error');
					/*Toast.info(res.msg,3,()=>{
						//this.props.history.pushState(null, '/');
					});*/
				}
			};
			this.props.actions.request(url, params, {});
		}
	}
	componentWillReceiveProps(nextProps) {
		console.log('componentWillReceiveProps');
	}
	componentWillUnmount () {
		console.info('卸载组件');
		this.props.actions.navigator();
	}	
	handleEdit(event) {
		this.setState({
			edit: !this.state.edit
		});
	}
	handleSelect(event){
		let $this  = event.target;
		let id = $this.getAttribute('data-id');
		this.props.actions.cartSelect(id);
	}
	handleDelete(event){
		let $this  = event.target;
		let id = $this.getAttribute('data-id');
		if(id == 'carts_lose'){
			id = this.props.cart.main.carts_lose;
			//console.log(id);
		}
		let url = types.CART_MAIN_DELETE;
		let param = {
			id:id||this.props.cart.main.carts
		};

		let params = {
			param: param,
			ajaxType: 'DELETE',
			onSuccess: (res) => {
				Toast.hide();
			},
			onError: (res) => {
				Toast.hide();
			}
		};
		if(param.id instanceof Array &&param.id.length==0){
			Toast.info('至少删除1件');
			return !1;
		}
		Modal.alert('删除', '确定删除么?', [
		   { text: '取消'},
		   { text: '确定', onPress: () => {
				Toast.loading(null, 0);
		   		this.props.actions.request(url, params);
		   }}
	 	]);
	}
	render() {
		//console.log('render');
		const {
			cart,
			actions
		} = this.props;
		const edit = this.state.edit;
		const {
			itemArr,
			itemObj,
			carts,
			carts_temp,
			_price,
			_count,
			_invalid,
			_quantity
		} = cart.main;
		return (
			<div>
				{
					_count == 0?
						<CartNo />
					:
					<div className="w-reset">
		      			<Header count={_count}
		      					edit 	= {edit}
		      					onEdit	={this.handleEdit}
		      			/>
		      			<List edit = {edit} 
		      				  onSelect = {this.handleSelect}
		      				  onDelete = {this.handleDelete}
		      				  actions = {actions}
		      				  itemArr = {itemArr}
	        				  itemObj= {itemObj}
	        				  carts = {carts}
		      			/>
		      			{_invalid>0&&
	      					<div className="w-tc">
	      						<i className="iconfont icon-clear" />
	      						<span onClick = {this.handleDelete} data-id="carts_lose">清除失效宝贝</span>
	      				  	</div> 
		      			}
		      			<Footer edit = {edit} 
		      					onSelect = {this.handleSelect}
		      					onDelete = {this.handleDelete}
		      					actions = {actions}
		      					carts= {carts}
		      					carts_temp= {carts_temp}
		      					_quantity= {_quantity}
		      					_price= {_price}
		      			/>
		      		</div>
				}
			</div>
		);
	}
}

Cart.propTypes = { //为了安全：这这里定义你的数据类型，小组件中定义传入某些state或者其他函数方法
	cart: React.PropTypes.shape({
		main :React.PropTypes.shape({
			_quantity:React.PropTypes.number,
      		carts: React.PropTypes.array.isRequired,
      		carts_temp: React.PropTypes.array.isRequired
    	}),
	}),
	actions: React.PropTypes.object
};


export default Cart;
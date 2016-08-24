import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import * as types from '../../constants/actions/cart';
/*ant*/
import {
	Toast
} from 'antd-mobile';
/*建议后期转化为无状态组件*/
class Header extends Component {

	constructor(props, context) {
		super(props, context);
		this.handleBuy = this.handleBuy.bind(this);
	}
	handleBuy(event){
		let {carts}=this.props.main;
		if(carts.length==0){
			Toast.info('至少购买1件');
		}else{
			let url = types.CART_POST_MAIN;
			let param = {
				id:carts
			};

			let params = {
				param: param,
				ajaxType: 'POST',
				onSuccess: (res) => {
					Toast.hide();
					this.props.history.pushState(null, '/');
				},
				onError: (res) => {
					Toast.hide();
				}
			};
			Toast.loading(null, 0);
			this.props.actions.request(url, params);
		}
	}
	render() {
		let {edit,main,onSelect,onDelete} = this.props;
		let {carts,carts_temp,_quantity,_price} = main;
		/*carts 与 carts_temp比较 判断是否全选*/
		let icon = carts.sort().toString() == carts_temp.sort().toString();
		let editHtml;
		if (edit) {
			editHtml = (
				<div>
					<div className="w-col-4 w-tr">
						<div>合计:<b>￥<em>{main._price}</em></b></div>
						<small>不含运费</small>
					</div>
					<div className="w-col-3 w-tc" onClick = {this.handleBuy}>
						结算
						(<em>{_quantity}</em>)
					</div>
				</div>
			);

		} else {
			editHtml = (
				<div className="w-col-3 w-col-ml-4 w-tc" onClick = {onDelete} >删除</div>
			);
		}

		return (
			<div className="cart-footer w-bg-white w-media-fixed">
				<div className="w-col-5">
					<i 	className={
							classnames(
								"iconfont w-tc icon-xuanzhong",
								{'w-green':icon}
							)
						} 
						onClick = {onSelect}
					/>
					全选
				</div>
				{editHtml}
			</div>
		);
	}
}
Header.propTypes = {
	
};
export default Header;
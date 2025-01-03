import React, { useEffect } from "react"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyCart, removeSelectedItems, selectAllItems, totalCart } from "../../store/modules/cartSlice";
import { CartListWrap, PaymentWrap } from "./CartStyle";
import { IoCheckboxSharp, IoSquareOutline } from "react-icons/io5";
import CartItem from "./CartItem";

const CartList = () => {
    const { carts, cartTotal } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false); // 팝업 상태

    // 선택된 항목의 총 수량 계산
    const totalQuantity = carts
        .filter((item) => item.selected) // 체크된 항목만 필터링
        .reduce((sum, item) => sum + item.quantity, 0);

    // 선택된 항목의 총 금액 계산
    const selectedTotal = carts
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 배송비 계산
    const shippingCost = totalQuantity === 0 ? 0 : selectedTotal >= 150000 ? 0 : 3000;

    // 총 결제 금액
    const totalAmount = selectedTotal + shippingCost;

    // 전체 선택 / 선택 해제 토글 함수
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);
        dispatch(selectAllItems(isChecked));
    };

    const handlePayment = () => {
        if (totalQuantity === 0) {
            alert("선택된 상품이 없습니다!");
            return;
        }
        setIsPaymentComplete(true); // 팝업 상태 활성화
    };

    const closeModal = () => {
        setIsPaymentComplete(false); // 팝업 닫기
    };

    useEffect(() => {
        setChecked(carts.length > 0 && carts.every((item) => item.selected));
        dispatch(totalCart());
    }, [carts, dispatch]);

    return (
        <CartListWrap className="cart-wrap">
            <div className="inner">
                <h2>장바구니</h2>
                <p>Cart({carts.length})</p>

                <label className="selected-all">
                    <div className="check">{checked ? <IoCheckboxSharp /> : <IoSquareOutline />}</div>
                    <input
                        type="checkbox"
                        name="select-all"
                        onChange={handleSelectAll}
                        checked={checked}
                    />{" "}
                    전체선택
                </label>

                <div className="cart-list-container">
                    <div className="cart-list">
                        {carts.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>

                    <PaymentWrap className="payment">
                        <div className="payment_box">
                            <h3>결제 예정금액</h3>
                            <p>
                                상품금액{" "}
                                <em>
                                    {selectedTotal
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                    원
                                </em>
                            </p>

                            <p>
                                할인금액 <em className="dc_amount">- 0 원</em>
                            </p>
                            <p>
                                배송비{" "}
                                <em className="shipping">
                                    + {shippingCost
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                    원
                                </em>
                            </p>
                            <hr />
                            <h4>
                                합계{" "}
                                <strong>
                                    {totalAmount
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                    원
                                </strong>
                            </h4>

                            <button onClick={handlePayment}>
                                총 {totalQuantity}개 구매하기
                            </button>
                        </div>
                    </PaymentWrap>
                </div>

                <p>
                    <button onClick={() => navigate("/product")}>쇼핑하러가기</button>
                    <button onClick={() => dispatch(emptyCart())}>
                        장바구니 비우기
                    </button>
                    <button onClick={() => dispatch(removeSelectedItems())}>
                        선택삭제
                    </button>
                </p>
            </div>

            {/* 결제 완료 팝업 */}
            {isPaymentComplete && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>주문이 정상적으로 처리되었습니다!</h3>
                        <p>감사합니다.</p>
                        <button onClick={closeModal}>확인</button>
                    </div>
                </div>
            )}
        </CartListWrap>
    );
};

export default CartList;

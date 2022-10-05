import { noop } from 'lodash';
import { PaymentInitializeOptions } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { Omit } from 'utility-types';

import HostedFieldPaymentMethod, {
    HostedFieldPaymentMethodProps,
} from './HostedFieldPaymentMethod';
import PaymentContext from '../PaymentContext';

export type SquarePaymentMethodProps = Omit<
    HostedFieldPaymentMethodProps,
    'cardCodeId' | 'cardExpiryId' | 'cardNumberId' | 'postalCodeId' | 'walletButtons'
>;

const SquarePaymentMethod: FunctionComponent<SquarePaymentMethodProps> = ({
    initializePayment,
    method,
    onUnhandledError = noop,
    ...rest
}) => {
    const paymentContext = useContext(PaymentContext);
    const initializeSquarePayment = useCallback(
        (options: PaymentInitializeOptions) =>
            initializePayment({
                ...options,
                square: {
                    cardNumber: {
                        elementId: 'sq-card-number',
                    },
                    cvv: {
                        elementId: 'sq-cvv',
                    },
                    expirationDate: {
                        elementId: 'sq-expiration-date',
                    },
                    postalCode: {
                        elementId: 'sq-postal-code',
                    },
                    inputClass: 'form-input',
                    // FIXME: Need to pass the color values of the theme
                    inputStyles: [
                        {
                            color: '#333',
                            fontSize: '13px',
                            lineHeight: '20px',
                        },
                    ],
                },
            }),
        [initializePayment],
    );

    return (
        <HostedFieldPaymentMethod
            {...rest}
            cardCodeId="sq-cvv"
            cardExpiryId="sq-expiration-date"
            cardNumberId="sq-card-number"
            initializePayment={initializeSquarePayment}
            method={method}
            postalCodeId="sq-postal-code"
            onUnhandledError={(e) => {
                onUnhandledError(e);
                paymentContext?.disableSubmit(method, true);
            }}
        />
    );
};

export default SquarePaymentMethod;

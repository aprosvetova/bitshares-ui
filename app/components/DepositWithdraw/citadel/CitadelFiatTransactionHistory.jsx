import React from "react";
import ChainTypes from "components/Utility/ChainTypes";
import BindToChainState from "components/Utility/BindToChainState";
import Translate from "react-translate-component";

class CitadelFiatTransactionHistory extends React.Component {
    static propTypes = {
        rpc_url: React.PropTypes.string,
        account: ChainTypes.ChainAccount
    };

    constructor(props) {
        super(props);
        this.state = {
            current_status: "never_loaded",
            withdrawals: null,
            deposits: null,
            error: null
        };
    }

    onShowCitadelTransactionHistory() {
        let json_rpc_request = {
            jsonrpc: "2.0",
            method: "getRequestsList",
            params: {
                bitsharesAccountName: this.props.account.get("name")
            },
            id: 1
        };
        let get_transaction_history_promise = fetch(this.props.rpc_url, {
            method: "POST",
            headers: new Headers({
                Accept: "application/json",
                "content-type": "application/x-www-form-urlencoded"
            }),
            body: "rq=" + encodeURIComponent(JSON.stringify(json_rpc_request))
        }).then(response => response.json());

        get_transaction_history_promise
            .then(json_response => {
                if ("result" in json_response) {
                    this.setState({
                        current_status: "loaded",
                        withdrawals: json_response.result.withdrawals,
                        deposits: json_response.result.deposits,
                        error: null
                    });
                } else if (
                    "error" in json_response &&
                    "message" in json_response.error
                )
                    throw json_repsonse.error.message;
                else throw "Unexpected response";
            })
            .catch(error => {
                this.setState({
                    current_status: "error",
                    withdrawals: null,
                    deposits: null,
                    error: "Error getting transaction history: " + error
                });
            });
    }

    render() {
        if (!this.props.account) return null;

        let citadel_withdrawal_history_fragment = null;
        if (this.state.current_status === "loaded") {
            let citadel_withdrawal_history_rows = [];
            if (this.state.withdrawals.length) {
                for (var i = 0; i < this.state.withdrawals.length; ++i)
                    citadel_withdrawal_history_rows.push(
                        <tr>
                            <td>
                                {this.state.withdrawals[i].amount}{" "}
                                {this.state.withdrawals[i].currency}
                            </td>
                            <td>{this.state.withdrawals[i].status}</td>
                        </tr>
                    );
                citadel_withdrawal_history_fragment = (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <Translate content="citadel.withdraw_amount" />
                                </th>
                                <th>
                                    <Translate content="citadel.status" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>{citadel_withdrawal_history_rows}</tbody>
                    </table>
                );
            } else
                citadel_withdrawal_history_fragment = (
                    <Translate component="p" content="citadel.withdraw_none" />
                );
        }

        let citadel_deposit_history_fragment = null;
        if (this.state.current_status === "loaded") {
            if (this.state.deposits.length) {
                let citadel_deposit_history_rows = [];
                for (var i = 0; i < this.state.deposits.length; ++i)
                    citadel_deposit_history_rows.push(
                        <tr>
                            <td>
                                {this.state.deposits[i].amount}{" "}
                                {this.state.deposits[i].currency}
                            </td>
                            <td>
                                <a
                                    href={this.state.deposits[i].link}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    link
                                </a>
                            </td>
                            <td>{this.state.deposits[i].status}</td>
                        </tr>
                    );
                citadel_deposit_history_fragment = (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <Translate content="citadel.deposit_amount" />
                                </th>
                                <th>
                                    <Translate content="citadel.deposit_details" />
                                </th>
                                <th>
                                    <Translate content="citadel.status" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>{citadel_deposit_history_rows}</tbody>
                    </table>
                );
            } else
                citadel_deposit_history_fragment = (
                    <Translate component="p" content="citadel.deposit_none" />
                );
        }

        let citadel_transaction_history_fragment = null;

        if (this.state.current_status === "error")
            citadel_transaction_history_fragment = (
                <div className="content-block">
                    <button
                        className={"button outline"}
                        onClick={this.onShowCitadelTransactionHistory.bind(
                            this
                        )}
                    >
                        <Translate content="citadel.retry" />
                    </button>
                    <p>{this.state.error}</p>
                </div>
            );
        else if (this.state.current_status === "loading")
            citadel_transaction_history_fragment = (
                <div className="content-block">
                    <button
                        className={"button outline"}
                        onClick={this.onShowCitadelTransactionHistory.bind(
                            this
                        )}
                        disabled="true"
                    >
                        <Translate content="citadel.show_transaction_history" />
                    </button>
                    <Translate component="p" content="citadel.loading" />
                </div>
            );
        else {
            let button_label =
                this.state.current_status === "never_loaded" ? (
                    <Translate content="citadel.show_transaction_history" />
                ) : (
                    <Translate content="citadel.refresh_transaction_history" />
                );
            citadel_transaction_history_fragment = (
                <div className="content-block">
                    <br />
                    <Translate
                        component="h4"
                        content="citadel.header_transaction_history"
                    />
                    <button
                        className={"button outline"}
                        onClick={this.onShowCitadelTransactionHistory.bind(
                            this
                        )}
                    >
                        {button_label}
                    </button>
                    {citadel_withdrawal_history_fragment}
                    {citadel_deposit_history_fragment}
                </div>
            );
        }

        return citadel_transaction_history_fragment;
    }
}

export default BindToChainState(CitadelFiatTransactionHistory, {
    keep_updating: true
});

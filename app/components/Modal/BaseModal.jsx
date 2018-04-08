import React from "react";
import {PropTypes} from "react";
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import Modal from "react-foundation-apps/src/modal";
import Trigger from "react-foundation-apps/src/trigger";
import Translate from "react-translate-component";
var logo = require("assets/logo-ico-blue.png");

class BaseModal extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.modalEscapeListener = function(e) {
            if (e.keyCode === 27) {
                ZfApi.publish(this.props.id, "close");
            }
        }.bind(this);

        document.addEventListener("keydown", this.modalEscapeListener);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.modalEscapeListener);
    }

    render() {
        const {props} = this;
        const {
            id,
            overlay,
            onClose,
            overlayClose,
            className,
            modalHeader,
            noCloseBtn,
            noLoggo,
            noHeader,
            children
        } = props;

        return (
            <Modal
                id={id}
                overlay={overlay}
                onClose={onClose}
                className={className}
                overlayClose={overlayClose}
            >
                {!noCloseBtn && (
                    <Trigger close={id}>
                        <a href="#" className="close-button">
                            &times;
                        </a>
                    </Trigger>
                )}
                {!noLoggo && (
                    <div className="modal__logo">
                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9Ii0yODEgNDA0LjkgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgLTI4MSA0MDQuOSAzMiAzMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9DQo8L3N0eWxlPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0tMjU0LDQzNC40aC0yMi42bDguOS0yNi44aDQuN0wtMjU0LDQzNC40eiBNLTI3NS4yLDQzMy40aDE5LjhsLTguMy0yNC44aC0zLjNMLTI3NS4yLDQzMy40eiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K" />
                    </div>
                )}
                {!noHeader &&
                    modalHeader && (
                        <div className="text-center">
                            <div className="modal__title">
                                <Translate
                                    component="h4"
                                    content={modalHeader}
                                />
                            </div>
                        </div>
                    )}
                {children}
            </Modal>
        );
    }
}

BaseModal.defaultProps = {
    overlay: false
};

BaseModal.propTypes = {
    id: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    className: PropTypes.string,
    overlay: PropTypes.bool,
    overlayClose: PropTypes.bool,
    noCloseBtn: PropTypes.bool
};

export default BaseModal;

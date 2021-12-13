import GenericVisibleModal from "../components/modals/GenericVisibleModal.vue";
import VisibleNotificationModal from "../components/modals/VisibleNotificationModal.vue";
import { createApp } from '@vue/runtime-dom';

export function generateErrorModal(error){
    var ComponentApp = createApp(GenericVisibleModal, {
        title: error.status,
        body: error.reason
    });

    mountApp(ComponentApp);
}

export function generateNavigationModal(title, body, options){
    const ComponentApp = createApp(VisibleNotificationModal, {
        title,
        body,
        options
    });

    mountApp(ComponentApp);
}

const mountApp = app => {
    const wrapper = document.createElement("div");
    wrapper.id = 'modal-holder';
    app.mount(wrapper);
    document.body.appendChild(wrapper);
}
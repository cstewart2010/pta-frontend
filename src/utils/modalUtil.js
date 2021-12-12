import GenericVisibleModal from "../components/partials/GenericVisibleModal.vue";
import VisibleNotificationModal from "../components/partials/VisibleNotificationModal.vue";
import { createApp } from '@vue/runtime-dom';

export function generateErrorModal(error){
    var ComponentApp = createApp(GenericVisibleModal, {
        title: error.status,
        body: error.reason
    });

    const wrapper = document.createElement("div");
    wrapper.id = 'modal-holder';
    ComponentApp.mount(wrapper);
    document.body.appendChild(wrapper);
}

export function generateNavigationModal(title, body, options){
    var ComponentApp = createApp(VisibleNotificationModal, {
        title,
        body,
        options
    });

    const wrapper = document.createElement("div");
    wrapper.id = 'modal-holder';
    ComponentApp.mount(wrapper);
    document.body.appendChild(wrapper);
}
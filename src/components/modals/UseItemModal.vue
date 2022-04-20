<template>
    <div class="modal fade" :id="'useItemModal-'+type" tabindex="-1" aria-labelledby="useItemModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="useItemModalLabel">Deletion Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <span class="input-group-text">
                            How many would you like to use? ({{item.name}}: {{item.amount}})
                        </span>
                        <input class="form-control" type="number" min="1" :max="item.amount" v-model="useAmount">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-light" @click="useItem" data-bs-dismiss="modal">Use {{item.name}}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { removeItems } from '../../api/trainer.api';
import { setPTAActivityToken } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil';
export default {
    name: 'UseItemModal',
    props: {
        item: {
            default: {
                name: "",
                amount: 0
            }
        },
        type: {
            default: ''
        }
    },
    data(){
        return {
            useAmount: 0
        }
    },
    methods: {        
        async useItem(){
            if (this.useAmount > this.item.amount){
                generateErrorModal({
                    status: "Failed",
                    reason: `You don't have enough ${this.item.name}.`
                });
                return;
            }
            
            await removeItems([{
                name: this.item.name,
                amount: this.useAmount
            }])
                .then((response) => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    this.$router.go();
                })
                .catch(generateErrorModal);
        }
    }
}
</script>
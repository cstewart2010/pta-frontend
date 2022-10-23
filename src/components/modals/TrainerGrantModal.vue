<template>
    <div class="modal fade" id="trainerGrantModal" tabindex="-1" aria-labelledby="trainerGrantModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="trainerGrantModalLabel">Grant to Trainers</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <div class="input-group my-2">
                        <span class="input-group-text">Add a group honor</span>
                        <textarea class="form-control" v-model="groupHonor" cols="30" rows="1" />
                        <button class="btn btn-secondary" @click="onGroupHonor">Add honor</button>
                    </div>
                    <div class="input-group my-2">
                        <span class="input-group-text">Add money to all</span>
                        <input type="number" class="form-control" v-model="groupAddition">
                        <button class="btn btn-secondary" @click="onGroupAddition">Add money</button>
                    </div>
                    <div class="input-group my-2">
                        <span class="input-group-text">Add a single honor</span>
                        <select class="form-select" v-model="singleHonorRecipient">
                            <option value=""></option>
                            <option v-for="trainer in regularTrainers" :key="trainer.trainerId" :value="trainer.trainerId">
                                {{trainer.trainerName}}
                            </option>
                        </select>
                        <textarea class="form-control" v-model="singleHonor" cols="30" rows="1" />
                        <button class="btn btn-secondary" @click="onSingleHonor">Add honor</button>
                    </div>
                    <div class="input-group my-2">
                        <span class="input-group-text">Add money to single trainer</span>
                        <select class="form-select" v-model="singleAdditionRecipient">
                            <option value=""></option>
                            <option v-for="trainer in regularTrainers" :key="trainer.trainerId" :value="trainer.trainerId">
                                {{trainer.trainerName}}
                            </option>
                        </select>
                        <input type="number" class="form-control" v-model="singleAddition">
                        <button class="btn btn-secondary" @click="onSingleAddition">Add money</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { addGroupHonor, addHonor, updateMoney, updateMoneyAll } from '../../api/trainer.api';
import { setPTAActivityToken } from '../../utils/localStorage';

export default {
    name: 'TrainerGrant',
    props: {
        regularTrainers: {
            default: []
        }
    },
    data(){
        return {
            groupHonor: '',
            singleHonor: '',
            singleHonorRecipient: '',
            groupAddition: '',
            singleAdditionRecipient: '',
            singleAddition: ''
        }
    },
    methods: {
        async onGroupHonor(){
            if (this.groupHonor.length == 0){
                return;
            }
            await addGroupHonor(this.groupHonor)
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    this.groupHonor = '';
                })
                .catch(console.log);
        },
        async onSingleHonor(){
            if (this.singleHonor.length == 0){
                return;
            }
            if (this.singleHonorRecipient.length == 0){
                return;
            }
            await addHonor(this.singleHonor, this.singleHonorRecipient)
                .then(response => {
                    setPTAActivityToken(response.headers['pta-activity-token']);
                    this.singleHonor = '';
                    this.singleHonorRecipient = '';
                })
                .catch(console.log);
        },
        async onGroupAddition(){
            await updateMoneyAll(this.groupAddition)
                .then(() => {
                    this.groupAddition = '';
                })
                .catch(console.log);
        },
        async onSingleAddition(){
            await updateMoney(this.singleAdditionRecipient, this.singleAddition)
                .then(() => {
                    this.singleAddition = '';
                    this.singleAdditionRecipient = '';
                })
                .catch(console.log);
        }
    }
}
</script>

<template>
    <div class="text-center">
        <h3>Moves</h3>
        <hr/>
        <div class="row">
            <div class="col-1">Name</div>
            <div class="col-2">
                <div class="row">
                    <div class="col-6">Uses</div>
                    <div class="col-6 text-truncate" data-bs-toggle="tooltip" title="Frequency">Frequency</div>
                </div>
            </div>
            <div class="col-2">
                <div class="row">
                    <div class="col-6">Range</div>
                    <div class="col-6">To Hit</div>
                </div>
            </div>
            <div class="col-2">Damage Roll</div>
            <div class="col-2">Type</div>
            <div class="col-2">Effect</div>
            <div class="col-1">Delete</div>
        </div>
        <hr/>
    </div>
    <div id="addedMvoes" class="my-1" v-if="trainerMoves">
        <div v-for="(move, index) in trainerMoves" :key="move">
            <div class="row d-flex align-items-center" :id="'move-'+index">
                <added-move :move="move" :user="trainerName" />
                <div class="col-1 text-center">
                    <button class="btn-close" @click="remove(index)" />
                </div>
            </div>
            <hr/>
        </div>
    </div>
    <div class="row" v-if="moves">
        <div class="col-3">
            <select class="form-select text-center my-1" name="move" v-model="addedMove">
                <option value=""></option>
                <option v-for="(move, index) in moves" :key="index" :id="move" :value="index + 1">
                    {{move}}
                </option>
            </select>
            <button class="btn btn-primary my-1" @click="addMove">Add this move</button>
        </div>
    </div>
</template>

<script>
import { getAllMoves } from '../../api/dex.api'
import { getDBMoves, getMoves, getTrainer, setDBMoves, setMoves } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedMove from './parts/AddedMove.vue';

export default {
    name: 'Trainer Moves',
    data(){
        return {
            moves: getDBMoves(),
            addedMove: '',
            trainerMoves: getMoves(),
            trainerName: getTrainer().trainerName
        }
    },
    components:{
        AddedMove
    },
    async beforeMount(){
        if (this.moves){
            return;
        }
        await getAllMoves()
            .then(response => {
                this.moves = response.data.results.map(result => result.name)
                setDBMoves(this.moves);
            })
            .catch(generateErrorModal);
    },
    methods:{
        addMove(){
            if (this.addedMove.length > 0){
                this.trainerMoves.push(this.addedMove);
                this.updateMoves();
            }
        },
        remove(index){
            this.trainerMoves = this.trainerMoves.filter((move, entryIndex) => entryIndex != index)
            this.updateMoves();
        },
        updateMoves(){
            setMoves(this.trainerMoves)
        }
    }
}
</script>
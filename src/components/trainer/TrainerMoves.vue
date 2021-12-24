<template>
    <div class="text-center">
        <h3>Moves</h3>
        <hr/>
        <div class="row">
            <div class="col-md-1">Name</div>
            <div class="col-md-2">
                <div class="row">
                    <div class="col-md-6">Uses</div>
                    <div class="col-md-6">Frequency</div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="row">
                    <div class="col-md-6">Range</div>
                    <div class="col-md-6">To Hit</div>
                </div>
            </div>
            <div class="col-md-2">Damage Roll</div>
            <div class="col-md-2">Type</div>
            <div class="col-md-2">Effect</div>
            <div class="col-md-1">Delete</div>
        </div>
        <hr/>
    </div>
    <div id="addedMvoes" class="my-1">
        <div v-for="(move, index) in trainerMoves" :key="move">
            <div class="row d-flex align-items-center" :id="'move-'+index">
                <added-move :move="move" />
                <div class="col-md-1 text-center">
                    <button class="btn-close" @click="remove(index)" />
                </div>
            </div>
            <hr/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-3">
            <select class="form-select text-center my-1" name="move" v-model="addedMove">
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
import { getMoves, setMoves } from '../../utils/localStorage';
import { generateErrorModal } from '../../utils/modalUtil'
import AddedMove from './parts/AddedMove.vue';

export default {
    name: 'Trainer Moves',
    data(){
        return {
            moves: [],
            addedMove: 'Struggle',
            trainerMoves: []
        }
    },
    components:{
        AddedMove
    },
    beforeMount:async function(){
        await getAllMoves()
            .then(response => {
                this.moves = response.data.results.map(result => result.name)
                const moves = getMoves();
                if (moves){
                    this.trainerMoves = moves;
                }
            })
            .catch(generateErrorModal);
    },
    methods:{
        addMove(){
            this.trainerMoves.push(this.addedMove);
            this.updateMoves();
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
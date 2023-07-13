import { UpdateAccelerationsStateVector } from "../physic/phisics1.js";
import { AddParcticleFromVoxelGrid, ClearVoxelGrid } from "../rnd/voxel.js";
import { _vec3 } from "./mathvec3.js"

export function CopyInStateVector (State_vector, Parcticle){
    let j = 0;
    State_vector[0] = 0;
    for (let i = 0; i < Parcticle.length; i++){
        if (Parcticle[i].IsActive){
          State_vector[0]++;
          State_vector[j * 3 + 1] = i;
          State_vector[j * 3 + 2] = Parcticle[i].body.center_of_mass;
          AddParcticleFromVoxelGrid(Parcticle[i].body.center_of_mass, i, Parcticle[i].body.invm)
          State_vector[j * 3 + 3] = Parcticle[i].body.V;
          j++;
        }
    }
}

export function PasteInParcticle (State_vector, Parcticle){
    for (let i = 0; i < State_vector[0]; i++){
        Parcticle[State_vector[i * 3 + 1]].body.center_of_mass = State_vector[i * 3 + 2];
        Parcticle[State_vector[i * 3 + 1]].body.V = State_vector[i * 3 + 3];
    }
    ClearVoxelGrid();
}

export function ForceToVectorState (State_vector, State_Vector_derivative, ParcticleStack){
    UpdateAccelerationsStateVector(State_vector, State_Vector_derivative, ParcticleStack);

    for (let i = 0; i < State_vector[0]; i++){
        State_Vector_derivative[i * 2] = State_vector[i * 3 + 3]
    }
}
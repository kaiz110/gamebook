

export default (state = null, action) => {
    switch(action.type){
        case 'CHAR_CREATE':
            return {
                name: action.payload,
                hp: 80,
                atk: 10,
                def: 0,
                agi: 5,
                lvl: 1,
                exp: 0,
                lvlupExp: 55,
                skillPoint: 0,
            }
        case 'CHAR_LEVEL_UP': 
            let tempLvl = state.lvl
            let tempLvlExp = state.lvlupExp
            let tempSkillPoint = state.skillPoint
            let tempCurrent = state.exp + action.payload
            let overflow = tempCurrent - tempLvlExp
            while(overflow >= 0){
                tempLvl++
                tempSkillPoint+=10
                tempLvlExp += (tempLvl-1) * 5
                if(overflow == 0) tempCurrent = 0
                overflow -= tempLvlExp
                if(overflow < 0){
                    tempCurrent = overflow + tempLvlExp
                }
            }
            return {...state, 
                    lvl: tempLvl,
                    exp: tempCurrent, 
                    lvlupExp: tempLvlExp,
                    skillPoint: tempSkillPoint
                }
        case 'CHAR_ATRB':
            let add = {}
            switch (action.payload) {
                case 'hp':
                    add = {hp: state.hp + 50}
                    break
                case 'atk':
                    add = {atk: state.atk + 1}
                    break
                case 'def':
                    add = {def: state.def + 1}
                    break
                case 'agi':
                    add = {agi: state.agi + 1}
                    break
                default:
                    break;
            }
            return Object.assign({}, state, add, {skillPoint: state.skillPoint - 1})
        case 'CHAR_DEL': 
            return null
        default: 
            return state
    }
}
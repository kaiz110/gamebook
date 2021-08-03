import { Dimensions } from "react-native"

export const SCREEN_WIDTH = Dimensions.get('window').width

export const SCREEN_HEIGHT = Dimensions.get('window').height

// NAVI0000 == navigate to | page
// DUELx000 == battle |   - charID
// FTUN011x == choose by dice | 2branchOR3branch(0,1) - ftunID -
// ATRB0111 == choose by attributes | attribute(1-atk,2-def,3-agi) - point need

export const CODE = {
    FTUN: 'FTUN',
    ATRB: 'ATRB',
    NAVI: 'NAVI',
    DUEL: 'DUEL',
    SU: 'SU', // branch success
    FA: 'FA', //fail
    DR: 'DR', // add
}

export const NAME_REGEX = /@main/g
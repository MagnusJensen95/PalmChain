

export const mapToPlantation = (responseArray) => {

    let plantation = {
        name: responseArray[0],
        approved: responseArray[1],
        pendingApproval: responseArray[2],
        address: responseArray.address
    }

    return plantation;

}
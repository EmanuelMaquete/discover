const Database = require("../db/config")

module.exports = {
    async create(req, res){

        const db = await Database()
        const pass = req.body.password
        let roomId

        let isRoom = true

        while (isRoom) {
            
            /*********  Gera o número da sala com 6 digitos, de forma randomica usando Math.random() e Math.floor() */
            for(var i = 0; i < 6; i++){
                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                roomId += Math.floor(Math.random() * 10).toString()
            }
            /*****Verifica se o número gerado para a sala já existe no banco, pra evitar erros */
    
            const roomExitIds = await db.all(`SELECT id FROM rooms`)
    
            /**** some() compara valor no array com o valor dado */
            isRoom = roomExitIds.some(roomExistId => roomExistId === roomId)

            if(!isRoom){
                /*******    Insere a sala no banco */
                await db.run(`INSERT INTO rooms(
                    id,
                    pass
                ) VALUES(
                    ${parseInt(roomId)},
                    ${pass}
                )`)
            }
        }

        await db.close()

       res.redirect(`/room/${roomId}`)
    },

    async open(req, res){
        const db = await Database()
        const roomId = req.params.room

        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} AND read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} AND read = 1`)

        let isNoQuestions

        if(questions.length == 0){
            if(questionsRead.length == 0){
                isNoQuestions = true
            }
        }

        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions})

    },

    enter(req, res){
        const roomId = req.body.roomId

        res.redirect(`/room/${roomId}`)
    }
}
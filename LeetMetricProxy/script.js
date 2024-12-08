document.addEventListener('DOMContentLoaded', function () {

    const userInput = document.getElementById('user-input');
    const searchBtn = document.getElementById('search-btn');
    const statsSection = document.querySelector('.stats-section');

    const progressSection = document.querySelector('.progress');
    const easyPie = document.querySelector('.easy-progress-item');
    const midPie = document.querySelector('.mid-progress-item');
    const hardPie = document.querySelector('.hard-progress-item');

    const easyLabel = document.querySelector('#easy-label');
    const midLabel = document.querySelector('#mid-label');
    const hardLabel = document.querySelector('#hard-label');

    const statsCard = document.querySelector('.stats-card')

    function updateProgress(solvedQue,totalQue,label,circle){
        const progressDegree = (solvedQue/totalQue)*100;
        label.innerHTML = `${solvedQue}/${totalQue}`
        circle.style.setProperty('--progress-deg',`${progressDegree}%`)
    }

    function displayUserData(parsedData){
        console.log('inside display user',parsedData.data.allQuestionsCount[0].count);
        const totalQue = parsedData.data.allQuestionsCount[0].count
        const totalEasyQue = parsedData.data.allQuestionsCount[1].count
        const totalMediumQue = parsedData.data.allQuestionsCount[2].count
        const totalHardQue = parsedData.data.allQuestionsCount[3].count
        
        const totalSolvedQue = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count
        const totalEasySolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count
        const totalMediumSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count
        const totalHardSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count
        
        console.log('after attach variable inside display user');
        console.log("logging data:", parsedData);
        updateProgress(totalEasySolved, totalEasyQue, easyLabel, easyPie)
        updateProgress(totalMediumSolved, totalMediumQue, midLabel, midPie)
        updateProgress(totalHardSolved, totalHardQue, hardLabel, hardPie)

        const cardData = [
            {
                label: "Overall Questions",
                value: parsedData.data.allQuestionsCount[0].count,
            }, {
                label: "Overall Submissions",
                value: parsedData.data.matchedUser.submitStats.acSubmissionNum[0].submissions
            }, {
                label: "Overall Easy Submissions",
                value: parsedData.data.matchedUser.submitStats.acSubmissionNum[1].submissions
            }, {
                label: "Overall Medium Submissions",
                value: parsedData.data.matchedUser.submitStats.acSubmissionNum[2].submissions
            }, {
                label: "Overall Hard Submissions",
                value: parsedData.data.matchedUser.submitStats.acSubmissionNum[3].submissions
            }
        ]

        console.log('cardData', cardData)
        statsCard.innerHTML = cardData.map((data) => `
                 <ul>
                    <li>${data.label}</li>
                    <li>${data.value}</li>
                </ul>
            `).join("")
    }

    function isValidUser(username) {
        if (username.trim() === "") {
            alert('Username Can\'t be empty')
            return false
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{0,14}$/
        const isMatching = regex.test(username)
        console.log('is matching', isMatching)

        if (!isMatching) {
            alert('Invalid username')
        }
        return isMatching
    }

    async function fetchUserData(username) {
        console.log('fetching user details');
        try {
            searchBtn.textContent = 'Searching...'
            userInput.disabled = true
            searchBtn.disabled = true
            // const response = await fetch(url)
            const proxyUrl = "https://cors-anywhere.herokuapp.com/"
            const url = `https://leetcode.com/graphql`
            const myHeaders = new Headers(); myHeaders.append("content-type", "application/json");
            const graphql = JSON.stringify({
                query: "\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n difficulty\n count\n}\n matchedUser (username: $username) {\n submitStats {\n acSubmissionNum {\n difficulty\n count\n submissions \n}\n totalSubmissionNum {\n difficulty\n count\n submissions\n   }\n  }\n  }\n}\n",
                variables: { "username": `${username}` }
            })

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            }

            const response = await fetch(proxyUrl+url,requestOptions)
            if (!response.ok) {
                throw new Error('Unable to Fetch Userdata')
            }
            const responseData = await response.json()
            console.log(responseData)
            displayUserData(responseData)
        }
        catch (error) {
            statsSection.innerHTML = '<p>No Data Found</p>'
            console.log(error);
        }
        finally {
            searchBtn.textContent = 'Search'
            userInput.disabled = false
            searchBtn.disabled = false
        }
    }

    searchBtn.addEventListener('click', function () {
        const username = userInput.value;
        console.log('username:', username)

        if (isValidUser(username)) {
            fetchUserData(username)
        }
    })
})

<div style="align:center"><p style="align:center">A PollingApi is a voting system that can be used to generate <b>quick</b> polling links that can be used in your project. It is completely free and easy to use</p>
<p style="align:center">
    <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" title="version" alt="version">

</p></div>

## API 

API Endpoint : http://127.0.0.1:3000 

### /api/v1/create
* `POST` : Create a new Poll

    #### Parameters :-   

   **Required:**
 
   `question=[string]`

   **Optional:**
 
   `parameter1=[string]`   
   `parameter2=[string]`    
    n number of parameters are allowed  etc ...  
           
```
POST: http://127.0.0.1:4455/api/v1/create?parameter1=React&parameter2=Angular&question=Vote
```
Then you will get a JSON responnse
```json
{
    "slug": "labwHuGxoZOR",
    "question": "Vote",
    "selection": [
        {
            "key": {
                "name": "React",
                "vote": 0
            }
        },
        {
            "key": {
                "name": "Angular",
                "vote": 0
            }
        }
    ]
}
```
```slug```: It is a unique ID which helps to identify your Poll. Basically it is your poll id.

### /api/v1/vote/poll_id/option
* `POST` : This end point allows users to vote on a particular poll.

```
POST: http://127.0.0.1:4455/api/v1/vote/labwHuGxoZOR/0

```
The final value ``0`` is the Option which user can choose. Here the vote goes to the ``0``th option in the poll with id ``labwHuGxoZOR``    
Now the following JSON response is obtained

```json
{
    "slug": "labwHuGxoZOR",
    "question": "Vote",
    "selection": [
        {
            "key": {
                "name": "React",
                "vote": 1
            }
        },
        {
            "key": {
                "name": "Angular",
                "vote": 0
            }
        }
    ]
}
```
The `vote` value of `React` is increased.



 ### /api/v1/result/poll_id/
 * `GET` : This end point allows users to view the result of Poll.

```
GET: http://127.0.0.1:4455/api/v1/result/bDeVrbuIKtjC/

```

```json
{
    "slug": "bDeVrbuIKtjC",
    "question": "Which language should i choose",
    "selection": [
        {
            "key": {
                "name": "test",
                "vote": 1
            }
        },
        {
            "key": {
                "name": "angular",
                "vote": 0
            }
        }
    ]
}
```
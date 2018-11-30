<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?
Sessions provide a way to persist data across requests. If we didn't have sessions, we'd be logging in again each time we make a request to a restricted page.

2. What does bcrypt do to help us store passwords in a secure manner?
bcrypt hashes passwords so that we aren't storing plain text passwords on our server.

3. What does bcrypt do to slow down attackers?
The manner that bcrypt hashes passwords in uses multiple rounds. Someone attempt to decrypt the hashed password would need the hash, the algorithm used, and the specific number of rounds used to generate the hash.

bcrypt also uses slow hashing instead of the fast hashing of MD5, SHA-128, etc. Those algorithms are built for speed, while bcrypt is built for guarding against offline brute force attacks by making the hash more secure.

4. What are the three parts of the JSON Web Token?
Payload, Signature, and Header.
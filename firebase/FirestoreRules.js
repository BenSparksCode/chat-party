// Copy of Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    //   blocks reading/writing unless given permission below
    match /{document=**} {
      allow read, write: if false;
    }
    
    // can read messages if logged in
    // can create message if function returns true...
    match /messages/{docId} {
      allow read: if request.auth.uid != null;
      allow create: if canCreateMessage();
    }
    
    function canCreateMessage() {
        let isSignedIn = request.auth.uid != null;
        let isOwner = request.auth.uid == request.resource.data.uid;
      
        // checks if user's uid exists in the banned collection
        let isNotBanned = exists(
            /databases/$(database)/documents/banned/$(request.auth.uid)
        ) == false;
      
        // true if user is signed in, is the owner of the data created, and is not on the banned list
        return isSignedIn && isOwner && isNotBanned;
    }
  }
}
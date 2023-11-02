CREATE TABLE users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
login TEXT NOT NULL,
email TEXT,
password TEXT NOT NULL,
premium BOOLEAN DEFAULT "FALSE"
);

CREATE TABLE posters(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
price REAL NOT NULL,
image TEXT NOT NULL
);

CREATE TABLE comments(
user INTEGER NOT NULL,
poster INTEGER NOT NULL,
message TEXT NOT NULL,
FOREIGN KEY (user) REFERENCES users(id),
FOREIGN KEY (poster) REFERENCES posters(id)
);

INSERT INTO users(login,email,password,premium)
VALUES ("alice","alice@uvvu.io","$2b$10$9DIOqBr6FC0XiBFv0zK4AO4iKFy/m4fbNiEtapApC5eS6NnWegfGW",1);

INSERT INTO users(login,email,password)
VALUES ("bob","bob@uvvu.io","$2b$10$gzdT1BxiZjQ8zEq5h7knF.UUTKGIvvSwQK28o/gfNjTLUGZ.eYtM2");

INSERT INTO posters(name,price,image)
VALUES ("Welcome",4.99,"alice/premium/Grumpy-Cat-Not-Amused.jpg");

INSERT INTO comments(user,poster,message)
VALUES (1,1,"Hey ! Have fun with our first poster !!\nMore comming soon");
# Install

I think this will work for you.

## 1. Install Brew
`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)”`

## 2. Install node, npm and yarn
`brew install node`

`brew install yarn`

## 3. Verify git is installed
I think you should have this. Try `git -v`. If it gives you a version number, you're set. Otherwise:

`brew install git`

## 4. Download my repository
In whatever folder you want the sunday-school-lessons folder to be:
```
git clone https://github.com/silcam/sunday-school-lessons.git
cd sunday-school-lessons
yarn install
```

## 5. Import from sources
First make folders for source languages in the sources folder. Then copy the `.odt` files into those folder. The file struture should look like:
```
sunday-school-lessons
   sources
      English
         Q1-L01.odt
         Q1-L02.odt
         ...
       French
          ...
```

Then run (from the sunday-school-lessons folder)

`npm run import-sources`

## 6. View imported strings

`npm run view-strings English Q1 L1`

or even

`npm run view-strings eng 1 1`





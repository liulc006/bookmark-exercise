const pg = require('pg');
const { nextTick } = require('process');
const Sequelize = require ('sequelize');

const client = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/bookmarker', {logging: false});

const Bookmark = client.define('bookmark', {
    name: Sequelize.STRING,
    url: Sequelize.TEXT
});

const Category = client.define('category', {
    name: Sequelize.STRING
});

Bookmark.belongsTo(Category);

async function setup() {
    try{
        await client.sync({force: true});

        const [search, code, jobs] = await Promise.all([Category.create({name: 'search'}),
                                                        Category.create({name: 'code'}),
                                                        Category.create({name: 'jobs'})]);
        const [google, stack, bing, linkedin, indeed, mdn]  = 
            await Promise.all([Bookmark.create({name: 'Google', url: 'https://www.google.com/', categoryId: search.id }),
                                        Bookmark.create({name: 'Stack Overflow', url: 'https://stackoverflow.com/', categoryId: code.id }),
                                        Bookmark.create({name: 'Bing', url: 'https://www.bing.com/', categoryId: search.id }),
                                        Bookmark.create({name: 'LinkedIn', url: 'https://www.linkedin.com/', categoryId: jobs.id }),
                                        Bookmark.create({name: 'Indeed', url: 'https://www.indeed.com/', categoryId: jobs.id }),
                                        Bookmark.create({name: 'MDN', url: 'https://developer.mozilla.org/en-US/', categoryId: code.id })
    ]);

        console.log();
        //res = await client.query(`SELECT * FROM bookmarks`)
    }
    catch(ex){
        console.log(ex);
    }
};

setup();
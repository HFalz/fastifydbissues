export async function getRoute(options){
    console.log("Options: ", options)
    const data1_query = `SELECT c.*, 
    (SELECT COUNT(*) FROM course_lessons cl WHERE cl.course_id = c.id) AS lessons_count
    FROM courses c
    WHERE c.id = ?`
    const data2_query = `SELECT l.*
    FROM lessons l
    JOIN course_lessons cl ON l.id = cl.lesson_id
    JOIN courses c ON cl.course_id = c.id
    WHERE c.id = ?`;

    let data1 = null;
    let data2 = null;
    let data3 = null;
    console.log("Connection: ", options.con)
    //Get Data with mysql2
    if (options.con == 0) {
        [[data1], [data2]] = await Promise.all([
            options.m_sql.execute(data1_query, [1]),
            options.m_sql.execute(data2_query, [1])
        ])
    }
    //Get Data with @fastify/mysql
    else if (options.con == 1) {
        [[data1], [data2], [data3]] = await Promise.all([
            options.f_mysql.mysql.query(data1_query, [1]),
            options.f_mysql.mysql.query(data2_query, [1]),
            options.f_mysql.mysql.query(data2_query, [1])
        ])
    }
    //Get Data with @planetbase/database client
    else if (options.con == 2) {
        [data1, data2] = await Promise.all([
            options.p_base.execute(data1_query, [1]),
            options.p_base.execute(data2_query, [1])
        ])
        data1 = data1['rows']
        data2 = data2['rows']
    }
    else {
        return {error: "No database connection found"}
    }

    return {data1: data1, data2: data2}
}
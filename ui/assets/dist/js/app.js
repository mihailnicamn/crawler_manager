const crawlers = () => {
    const load_table = () => {
        window.table = $('#my_crawlers').DataTable({
            "columnDefs": [
                { "className": "dt-center", "targets": "_all" }
            ],
            language: {
                searchBuilder: {
                    title: {
                        _: 'Find by (%d)',
                        0: 'Find'
                    },
                },
            },
            dom: 'Qfrtip'
        });
    }
    const init = () => {
        $(document).ready(function () {
            load_table();
        });
    }
    return {
        init: init,
        table: {
            load_table: load_table
        }
    }
}
const prepare = () => {
    window.editors = {
        js: `// this will run after the page is loaded using puppeteer\n// "page" variable keeps the loaded page\npage.click("element")`,
        pro_js: `try {const puppeteer = require('puppeteer');\n const browser = await puppeteer.launch();\n const page = await browser.newPage();\n await page.goto('https://example.com');\n await browser.close();}\ncatch (error) {\n process.send({error: error});\n}`,
        yaml: `# this will run after the page is loaded using puppeteer\n# \"page\" variable keeps the loaded page\n- define :\n    key : "test" # key to save data\n    value : "1" # value to save\n    type : "number" # string, number, boolean\n- set : \n    key : \"test\" # key to save data\n    value : \"test\" # value to save\n    type : \"string\" # string, number, boolean\n# puppeteer\n- click : \"#test\" # selector\n- wait : 1000 # miliseconds\n- pageSave : \n    key : \"test\" # key to save data\n    selector : \"test\"\n    data : \"test\" # class, id, name, tag, text, value\n- save :\n    key : \"test\" # key to save data\n    from : \"test\" # from already defined key\n- write :\n    keyword : \"test\" # keyword to input\n- inject :\n    script : \"test\" # script to inject\n- evaluate :\n    script : \"test\" # script to evaluate\n    return : \"test\" # return value to defined key`
    }
    const tooltips = () => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
    const form = () => {
        $('[name="url"]').on('keyup change', function () {
            if ($(this).val().includes("{{sub}}")) {
                $('.addSub').show();
            } else {
                $('.addSub').hide();
            }
        });
        $('[name="url"]').on('keyup change', function () {
            window.editor_pro_updater.description.url($(this).val());
        });
        $('.addSub').on('click', function () {
            var sub_id = $('#sub_inputs').children().length;
            sub_id++;
            console.log(sub_id)
            var element = `
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="sub_label">Sub${sub_id}</span>
          </div>
          <input type="text" class="form-control sub_input" placeholder="/page" aria-label="sub_label" aria-describedby="sub_label">
          <div class="input-group-append">
          <button class="btn btn-outline-danger removeSub" type="button">Remove</button>
        </div>
        </div>`;
            $('#sub_inputs').append(element);
        });
        $(document).on('click', '.removeSub', function () {
            $(this).parent().parent().remove();
            $('#sub_inputs').children().each(function (index, element) {
                //update the label
                console.log("updating label", index, "for", $(element).find('#sub_label').text())
                $(element).find('#sub_label').text('Sub' + (index + 1));
            });
            window.editor_pro_updater.description.pages($('#sub_inputs').children().map(function () {
                return $(this).find('input').val();
            }).get());
        });
        $(document).on('keyup change', '.sub_input', function () {
            var pages = $('#sub_inputs').children().map(function () {
                return $(this).find('input').val();
            }).get()
            console.log(pages)
            window.editor_pro_updater.description.pages(pages);
        });
        $(document).on('keyup change', '[name="name"]', function () {
            window.editor_pro_updater.description.name($(this).val());
        });
    }
    const config = () => {
        $(".editorJS").hide();
        $(".editorCONFIG").hide();
        const hide = {
            flow_type: () => $(".configOPTIONS").hide(),
            js_editor: () => $(".editorJS").hide(),
            config_editor: () => $(".editorCONFIG").hide()
        }
        const show = {
            flow_type: () => $(".configOPTIONS").show(),
            js_editor: () => $(".editorJS").show(),
            config_editor: () => $(".editorCONFIG").show()
        }
        const js_EDITOR = () => {
            window.js_EDITOR = CodeMirror.fromTextArea($('#js_editor')[0], {
                lineNumbers: true,
                matchBrackets: true
            });
            window.js_EDITOR.setValue(js_beautify(window.editors.js, { indent_size: 2, space_in_empty_paren: true }));
            window.js_EDITOR.setOption("theme", "ayu-dark");
            window.js_EDITOR.setOption("mode", "javascript");
            window.js_EDITOR.on("change", function () {
                window.editors.js = window.js_EDITOR.getValue();
            });
        }
        const js_pro_EDITOR = () => {
            window.js_pro_EDITOR = CodeMirror.fromTextArea($('#js_pro_editor')[0], {
                lineNumbers: true,
                matchBrackets: true,
            });
            window.js_pro_EDITOR.setValue(js_beautify(window.editors.pro_js, { indent_size: 2, space_in_empty_paren: true }));
            window.js_pro_EDITOR.setOption("theme", "ayu-dark");
            window.js_pro_EDITOR.setOption("mode", "javascript");
            $(window.js_pro_EDITOR.getWrapperElement()).hide();
            window.js_pro_EDITOR.on("change", function () {
                window.editors.pro_js = window.js_pro_EDITOR.getValue();
            });
        }
        const config_EDITOR = () => {
            window.config_EDITOR = CodeMirror.fromTextArea($('#config_editor')[0], {
                lineNumbers: true,
                matchBrackets: true
            });
            window.config_EDITOR.setValue(window.editors.yaml);
            window.config_EDITOR.setOption("theme", "ayu-dark");
            window.config_EDITOR.setOption("mode", "yaml");
            window.config_EDITOR.on("change", function () {
                window.editors.yaml = window.config_EDITOR.getValue();
            });
        }
        const console_OUTPUT = () => {
            window.console_OUTPUT = CodeMirror.fromTextArea($('#console-output')[0], {
                lineNumbers: true,
                matchBrackets: true,
                readOnly: true
            });
            window.console_OUTPUT.setValue("Console Output : ");
            window.console_OUTPUT.setOption("theme", "ayu-dark");
            window.console_OUTPUT.setOption("mode", "yaml");
            window.console_OUTPUT.setOption("readOnly", true);
            $(window.console_OUTPUT.getWrapperElement()).hide();
        }
        const run_RESULT = () => {
            window.run_RESULT = CodeMirror.fromTextArea($('#run-result')[0], {
                lineNumbers: true,
                matchBrackets: true,
                readOnly: true
            });
            window.run_RESULT.setValue("Run Result : ");
            window.run_RESULT.setOption("theme", "ayu-dark");
            window.run_RESULT.setOption("mode", "yaml");
            window.run_RESULT.setOption("readOnly", true);
            $(window.run_RESULT.getWrapperElement()).hide();
        }
        window.editor_pro_updater = {
            description: {
                name: (name) => {
                    var key = `global.scraper.name`;
                    var this_script = window.js_pro_EDITOR.getValue();
                    var lines = this_script.split(`\n`)
                    var new_line = `//${key} = "${name.replaceAll("{{sub}}", "")}";`;
                    var filtered_lines = lines.filter(line => line.includes(key));
                    var this_line = filtered_lines.filter(line => line.split("=")[0].includes(key));
                    if (this_line.length == 0) {
                        window.js_pro_EDITOR.setValue(js_beautify(`${new_line}\n${this_script}`, { indent_size: 2, space_in_empty_paren: true }));
                    } else {
                        var new_script = this_script;
                        this_line.map(line => {
                            new_script = new_script.replace(line, new_line);
                            window.js_pro_EDITOR.setValue(js_beautify(new_script, { indent_size: 2, space_in_empty_paren: true }));
                            return line;
                        });
                    }
                },
                url: (url) => {
                    var key = `global.scraper.base_url`;
                    var this_script = window.js_pro_EDITOR.getValue();
                    var lines = this_script.split(`\n`)
                    var new_line = `//${key} = "${url.replaceAll("{{sub}}", "")}";`;
                    var filtered_lines = lines.filter(line => line.includes(key));
                    var this_line = filtered_lines.filter(line => line.split("=")[0].includes(key));
                    if (this_line.length == 0) {
                        window.js_pro_EDITOR.setValue(js_beautify(`${new_line}\n${this_script}`, { indent_size: 2, space_in_empty_paren: true }));
                    } else {
                        var new_script = this_script;
                        this_line.map(line => {
                            new_script = new_script.replace(line, new_line);
                            window.js_pro_EDITOR.setValue(js_beautify(new_script, { indent_size: 2, space_in_empty_paren: true }));
                            return line;
                        });
                    }
                },
                pages: (pages) => {
                    var key = `global.scraper.pages`;
                    var this_script = window.js_pro_EDITOR.getValue();
                    var lines = this_script.split(`\n`)
                    var new_line = `//${key} = JSON.parse(${JSON.stringify(pages)});`;
                    var filtered_lines = lines.filter(line => line.includes(key));
                    var this_line = filtered_lines.filter(line => line.split("=")[0].includes(key));
                    if (this_line.length == 0) {
                        window.js_pro_EDITOR.setValue(js_beautify(`${new_line}\n${this_script}`, { indent_size: 2, space_in_empty_paren: true }));
                    } else {
                        var new_script = this_script;
                        this_line.map(line => {
                            new_script = new_script.replace(line, new_line);
                            window.js_pro_EDITOR.setValue(js_beautify(new_script, { indent_size: 2, space_in_empty_paren: true }));
                            return line;
                        });
                    }
                }
            }
        }
        $('.createCONFIG').on('click', function () {
            hide.js_editor();
            show.config_editor();
            $('.importJS').addClass('btn-cammo').removeClass('btn-primary');
            $(this).addClass('btn-primary').removeClass('btn-cammo');
        });
        $('.importJS').on('click', function () {
            hide.config_editor();
            show.js_editor();
            $('.createCONFIG').addClass('btn-cammo').removeClass('btn-primary');
            $(this).addClass('btn-primary').removeClass('btn-cammo');
        });
        $(".runJS").on('click', function () {
            //verify if its hidden
            if ($(".loader").is(":hidden")) {
                $(".loader").show();
                if ($(".proJS").hasClass('btn-primary')) {
                    $(window.console_OUTPUT.getWrapperElement()).show();
                }

                $(window.run_RESULT.getWrapperElement()).show();
            } else {
                $(".loader").hide();
            }
        });
        $('.proJS').on('click', function () {
            if ($(this).hasClass('btn-primary')) {
                $(this).addClass('btn-cammo').removeClass('btn-primary');
                $(window.js_pro_EDITOR.getWrapperElement()).hide();
                $(window.js_EDITOR.getWrapperElement()).show();
            } else {
                $(this).addClass('btn-primary').removeClass('btn-cammo');
                $(window.js_EDITOR.getWrapperElement()).hide();
                $(window.js_pro_EDITOR.getWrapperElement()).show();
            }
        });
        js_EDITOR();
        js_pro_EDITOR();
        config_EDITOR();
        console_OUTPUT();
        run_RESULT();
    }
    const init = () => {
        $('.addSub').hide();
        $(".loader").hide();
        $(document).ready(function () {
            tooltips();
            form();
            config();
        });
    }
    return {
        init: init
    }
}

window.app = {
    crawlers: crawlers,
    prepare: prepare
}
const crawlers = () => {
    const load_table = () => {
        window.table = $('#my_crawlers').DataTable({
    responsive: true,
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
            load_table();
            $('.dtsb-dropDown').removeClass('btn-light').addClass('btn btn-cammo').addClass('text-white');
            $('.dtsb-button').removeClass('btn-light').addClass('btn btn-cammo').addClass('text-white');
            $('dtsb-button').removeClass('btn-light').addClass('btn btn-cammo').addClass('text-white');
        
        $(document).bind('DOMSubtreeModified', function () {
            $('.dtsb-dropDown').removeClass('btn-light').addClass('btn btn-cammo').addClass('text-white');
            $('.dtsb-button').removeClass('btn-light').addClass('btn btn-cammo').addClass('text-white');
            $('dtsb-button').removeClass('btn-light').addClass('btn btn-cammo').addClass('text-white');
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
        pro_js: `try {const puppeteer = require('puppeteer');\n const browser = await puppeteer.launch();\n const page = await browser.newPage();\n await page.goto(global.scraper.base_url);\n await browser.close();}\ncatch (error) {\n process.send({error: error});\n}`,
        yaml: `# this will run after the page is loaded using puppeteer\n# \"page\" variable keeps the loaded page\n- define :\n    key : "test" # key to save data\n    value : "1" # value to save\n    type : "number" # string, number, boolean\n- set : \n    key : \"test\" # key to save data\n    value : \"test\" # value to save\n    type : \"string\" # string, number, boolean\n# puppeteer\n- click : \"#test\" # selector\n- wait : 1000 # miliseconds\n- pageSave : \n    key : \"test\" # key to save data\n    selector : \"test\"\n    data : \"test\" # class, id, name, tag, text, value\n- save :\n    key : \"test\" # key to save data\n    from : \"test\" # from already defined key\n- write :\n    keyword : \"test\" # keyword to input\n- inject :\n    script : \"test\" # script to inject\n- evaluate :\n    script : \"test\" # script to evaluate\n    return : \"test\" # return value to defined key`,
        console : `Console output `,
        run: `Run result `,
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
            window.config_EDITOR.setValue(js_beautify(window.config_EDITOR.getValue(), { indent_size: 2, space_in_empty_paren: true }));
            $('.importJS').addClass('btn-cammo').removeClass('btn-primary');
            $(this).addClass('btn-primary').removeClass('btn-cammo');
        });
        $('.importJS').on('click', function () {
            hide.config_editor();
            show.js_editor();

            window.js_EDITOR.setValue(js_beautify(window.js_EDITOR.getValue(), { indent_size: 2, space_in_empty_paren: true }));
            //reload the editor
            $('.createCONFIG').addClass('btn-cammo').removeClass('btn-primary');
            $(this).addClass('btn-primary').removeClass('btn-cammo');
        });
        $(".format_editor").on('click', function () {
            window.js_EDITOR.setValue(js_beautify(window.js_EDITOR.getValue(), { indent_size: 2, space_in_empty_paren: true }));
            window.js_pro_EDITOR.setValue(js_beautify(window.js_pro_EDITOR.getValue(), { indent_size: 2, space_in_empty_paren: true }));
            window.config_EDITOR.setValue(js_beautify(window.config_EDITOR.getValue(), { indent_size: 2, space_in_empty_paren: true }));
        });
        window.console_log = (data) => {
            window.console_OUTPUT.setValue(window.console_OUTPUT.getValue() + "\n" + data.toString());
        }
        window.run_log = (data) => {
            window.run_RESULT.setValue(window.run_RESULT.getValue() + "\n" + data.toString());
        }
        $(".runJS").on('click', function () {
            if($('[name="name]').val() == '' || $('[name="url"]').val() == '') return alert('Please fill in the name and url fields');
            //verify if its hidden
            if ($(".loader").is(":hidden")) {
                $(window.run_RESULT.getWrapperElement()).show();
                $(".loader").show();
                $(".runJS").removeClass('btn-cammo').addClass('btn-primary');
                if ($(".proJS").hasClass('btn-primary')) {
                    $(window.console_OUTPUT.getWrapperElement()).show();
                }else{
                    $(window.console_OUTPUT.getWrapperElement()).hide();
                }

                window.run_RESULT.setValue(window.editors.run + $('[name="name"]').val() + `:`);
                window.console_OUTPUT.setValue(window.editors.console + $('[name="name"]').val() + `:`);
            } else {
                $(".runJS").removeClass('btn-primary').addClass('btn-cammo');
                window.run_RESULT.setValue(window.run_RESULT.getValue() + `\nStopped by user`);
                window.console_OUTPUT.setValue(window.console_OUTPUT.getValue() + `\nStopped by user`);
                $(".loader").hide();
            }
        });
        $('.proJS').on('click', function () {
            if ($(this).hasClass('btn-primary')) {
                $(this).addClass('btn-cammo').removeClass('btn-primary');
                $(window.js_pro_EDITOR.getWrapperElement()).hide();
                $(window.js_EDITOR.getWrapperElement()).show();
                window.js_EDITOR.setValue(js_beautify(window.js_EDITOR.getValue(), { indent_size: 2, space_in_empty_paren: true }));
            } else {
                $(this).addClass('btn-primary').removeClass('btn-cammo');
                $(window.js_EDITOR.getWrapperElement()).hide();
                $(window.js_pro_EDITOR.getWrapperElement()).show();
                window.js_pro_EDITOR.setValue(js_beautify(window.js_pro_EDITOR.getValue(), { indent_size: 2, space_in_empty_paren: true }));
            }
        });
        js_EDITOR();
        js_pro_EDITOR();
        config_EDITOR();
        console_OUTPUT();
        run_RESULT();
    }
    window.load_template_recipe = (id) => {
        if(id != undefined) {
        var template = window.template_recipes.filter(template => template.id == id)[0];
        $('[name="name"]').val(template.name);
        $('[name="url"]').val(template.url);
        window.editors.js = template.script;
        window.editors.pro_js = template.script;
    }
    }
    //get query params
    window.queryParameters = {};
    window.getQueryParams = () => {
        const full_url = window.location.href;
        if(full_url.includes('?') == false) return {};
        full_url.split('?')[1].split('&').forEach(param => {
            var key = param.split('=')[0];
            var value = param.split('=')[1];
            window.queryParameters[key]= value;
        });
        return window.queryParameters;
    }
    window.load_template_recipe(window.getQueryParams().id);
    const init = () => {
        $('.addSub').hide();
        $(".loader").hide();
            tooltips();
            form();
            config();
    }
    return {
        init: init
    }
}

window.app = {
    crawlers: crawlers,
    prepare: prepare
}